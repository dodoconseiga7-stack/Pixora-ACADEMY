/**
 * PIXORA ACADEMY — Gestionnaire Vidéo Vitrine (Hero Video)
 * Supporte :
 * 1. Téléversement de fichier (MP4, WEBM, MOV, etc.)
 * 2. Remplacement et suppression
 * 3. Stockage persistant sans limite via IndexedDB (mode local)
 * 4. Upload Cloud temps réel via Firebase Storage (mode synchronisé)
 * 5. Support des liens URL vidéo directs
 * 6. Synchronisation multi-onglets et temps réel
 */

window.PixoraVideo = (function () {
    const DB_NAME = 'pixora_media_db';
    const DB_VERSION = 1;
    const STORE_NAME = 'videos';
    const HERO_KEY = 'hero_video_blob';
    const SYNC_KEY = 'pixora_video_trigger';

    let dbInstance = null;
    let cachedBlobUrl = null;

    // ─── Initialisation IndexedDB ─────────────────────────────────
    function getDb() {
        if (dbInstance) return Promise.resolve(dbInstance);

        return new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) {
                console.warn('[PixoraVideo] IndexedDB non supporté');
                resolve(null);
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };

            request.onsuccess = (e) => {
                dbInstance = e.target.result;
                resolve(dbInstance);
            };

            request.onerror = (e) => {
                console.error('[PixoraVideo] Erreur ouverture IndexedDB:', e);
                resolve(null);
            };
        });
    }

    // ─── IndexedDB CRUD ──────────────────────────────────────────
    async function storeBlobLocally(blob, name, size, type) {
        const db = await getDb();
        if (!db) return false;

        return new Promise((resolve, reject) => {
            try {
                const tx = db.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const record = {
                    blob: blob,
                    name: name,
                    size: size,
                    type: type,
                    updatedAt: Date.now()
                };
                const req = store.put(record, HERO_KEY);
                req.onsuccess = () => resolve(true);
                req.onerror = (err) => {
                    console.error('[PixoraVideo] Erreur écriture blob:', err);
                    resolve(false);
                };
            } catch (err) {
                console.error('[PixoraVideo] Erreur transaction IndexedDB:', err);
                resolve(false);
            }
        });
    }

    async function getStoredBlobLocally() {
        const db = await getDb();
        if (!db) return null;

        return new Promise((resolve) => {
            try {
                const tx = db.transaction([STORE_NAME], 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get(HERO_KEY);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            } catch (err) {
                resolve(null);
            }
        });
    }

    async function removeStoredBlobLocally() {
        const db = await getDb();
        if (!db) return true;

        return new Promise((resolve) => {
            try {
                const tx = db.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.delete(HERO_KEY);
                req.onsuccess = () => resolve(true);
                req.onerror = () => resolve(false);
            } catch (err) {
                resolve(false);
            }
        });
    }

    // ─── Firebase Storage Upload ─────────────────────────────────
    function isFirebaseStorageAvailable() {
        try {
            return typeof firebase !== 'undefined' &&
                   firebase.apps &&
                   firebase.apps.length > 0 &&
                   typeof firebase.storage === 'function';
        } catch (e) {
            return false;
        }
    }

    async function uploadToFirebaseStorage(file, onProgress) {
        if (!isFirebaseStorageAvailable()) return null;

        try {
            const storage = firebase.storage();
            const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
            const path = `hero-video/video_${Date.now()}_${safeName}`;
            const ref = storage.ref(path);

            return new Promise((resolve, reject) => {
                const uploadTask = ref.put(file);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        if (typeof onProgress === 'function' && snapshot.totalBytes > 0) {
                            const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            onProgress(percent);
                        }
                    },
                    (error) => {
                        console.warn('[PixoraVideo] Erreur upload Firebase Storage:', error);
                        reject(error);
                    },
                    async () => {
                        const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
                        resolve(downloadUrl);
                    }
                );
            });
        } catch (err) {
            console.warn('[PixoraVideo] Exception upload Firebase:', err);
            return null;
        }
    }

    // ─── Obtenir les métadonnées de la vidéo ─────────────────────
    async function getVideoInfo() {
        const data = (typeof window.getData === 'function') ? window.getData() : {};
        const heroVideo = data.settings && (data.settings.heroVideo || data.settings.heroVideoUrl);

        if (!heroVideo) {
            // Vérifier si un blob local existe encore
            const localRec = await getStoredBlobLocally();
            if (localRec && localRec.blob) {
                return {
                    hasVideo: true,
                    name: localRec.name || 'Vidéo importée (local)',
                    size: localRec.size || 0,
                    type: localRec.type || 'video/mp4',
                    updatedAt: localRec.updatedAt || Date.now(),
                    isLocal: true,
                    url: 'indexeddb://' + HERO_KEY
                };
            }
            return { hasVideo: false };
        }

        if (typeof heroVideo === 'string') {
            return {
                hasVideo: true,
                name: 'Vidéo vitrine',
                url: heroVideo,
                isLocal: heroVideo.startsWith('indexeddb:') || heroVideo.startsWith('blob:'),
                updatedAt: Date.now()
            };
        }

        return {
            hasVideo: Boolean(heroVideo.url),
            name: heroVideo.name || 'Vidéo vitrine',
            url: heroVideo.url || '',
            size: heroVideo.size || 0,
            type: heroVideo.type || 'video/mp4',
            updatedAt: heroVideo.updatedAt || Date.now(),
            isLocal: Boolean(heroVideo.isLocal)
        };
    }

    // ─── Obtenir l'URL de lecture directe ─────────────────────────
    async function getVideoUrl() {
        const info = await getVideoInfo();
        if (!info.hasVideo || !info.url) {
            return 'assets/videos/hero-video.mp4';
        }

        // Si c'est stocké dans IndexedDB
        if (info.isLocal || info.url.startsWith('indexeddb:')) {
            const localRec = await getStoredBlobLocally();
            if (localRec && localRec.blob) {
                if (cachedBlobUrl) {
                    URL.revokeObjectURL(cachedBlobUrl);
                }
                cachedBlobUrl = URL.createObjectURL(localRec.blob);
                return cachedBlobUrl;
            }
            return 'assets/videos/hero-video.mp4';
        }

        // Si c'est une URL directe (http, https, cloud, data ou chemin relatif)
        return info.url || 'assets/videos/hero-video.mp4';
    }

    // ─── Enregistrer un fichier vidéo ────────────────────────────
    async function saveVideoFile(file, onProgress) {
        if (!file) throw new Error('Aucun fichier sélectionné');

        // 1. Sauvegarde locale prioritaire dans IndexedDB
        await storeBlobLocally(file, file.name, file.size, file.type);

        let finalUrl = 'indexeddb://' + HERO_KEY;
        let isLocal = true;

        // 2. Si Firebase Storage est disponible, téléverser pour le cloud
        if (isFirebaseStorageAvailable()) {
            try {
                if (typeof onProgress === 'function') onProgress(10);
                const cloudUrl = await uploadToFirebaseStorage(file, (p) => {
                    if (typeof onProgress === 'function') {
                        onProgress(10 + p * 0.85); // de 10% à 95%
                    }
                });
                if (cloudUrl) {
                    finalUrl = cloudUrl;
                    isLocal = false;
                }
            } catch (err) {
                console.warn('[PixoraVideo] Poursuite avec stockage local :', err);
            }
        }

        if (typeof onProgress === 'function') onProgress(100);

        // 3. Mettre à jour les données de l'application
        const data = (typeof window.getData === 'function') ? window.getData() : {};
        if (!data.settings) data.settings = {};

        data.settings.heroVideo = {
            url: finalUrl,
            name: file.name,
            size: file.size,
            type: file.type || 'video/mp4',
            updatedAt: Date.now(),
            isLocal: isLocal
        };
        data.settings.heroVideoUrl = finalUrl;

        if (typeof window.saveData === 'function') {
            window.saveData(data);
        }

        notifyChange();

        return data.settings.heroVideo;
    }

    // ─── Enregistrer une URL vidéo directe ───────────────────────
    async function saveVideoUrl(url, name = 'Lien vidéo externe') {
        const cleanUrl = (url || '').trim();
        if (!cleanUrl) throw new Error('Veuillez renseigner une URL valide');

        // Nettoyer l'éventuel blob local
        await removeStoredBlobLocally();
        if (cachedBlobUrl) {
            URL.revokeObjectURL(cachedBlobUrl);
            cachedBlobUrl = null;
        }

        const data = (typeof window.getData === 'function') ? window.getData() : {};
        if (!data.settings) data.settings = {};

        data.settings.heroVideo = {
            url: cleanUrl,
            name: name,
            size: 0,
            type: 'video/mp4',
            updatedAt: Date.now(),
            isLocal: false
        };
        data.settings.heroVideoUrl = cleanUrl;

        if (typeof window.saveData === 'function') {
            window.saveData(data);
        }

        notifyChange();

        return data.settings.heroVideo;
    }

    // ─── Supprimer la vidéo ──────────────────────────────────────
    async function deleteVideo() {
        await removeStoredBlobLocally();

        if (cachedBlobUrl) {
            URL.revokeObjectURL(cachedBlobUrl);
            cachedBlobUrl = null;
        }

        const data = (typeof window.getData === 'function') ? window.getData() : {};
        if (data.settings) {
            data.settings.heroVideo = null;
            data.settings.heroVideoUrl = '';
            if (typeof window.saveData === 'function') {
                window.saveData(data);
            }
        }

        notifyChange();
        return true;
    }

    // ─── Notification multi-onglets & événements ─────────────────
    function notifyChange() {
        try {
            localStorage.setItem(SYNC_KEY, Date.now().toString());
        } catch (e) {}

        const evt = new CustomEvent('pixora-video-updated', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(evt);
    }

    // ─── Utilitaire format de taille ─────────────────────────────
    function formatBytes(bytes) {
        if (!bytes || bytes <= 0) return 'Taille inconnue';
        const k = 1024;
        const sizes = ['Octets', 'Ko', 'Mo', 'Go'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return {
        getVideoInfo,
        getVideoUrl,
        saveVideoFile,
        saveVideoUrl,
        deleteVideo,
        formatBytes
    };
})();
