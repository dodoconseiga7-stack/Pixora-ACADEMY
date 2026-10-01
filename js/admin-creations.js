/**
 * PIXORA ACADEMY — Gestion Créations Admin
 * Upload Firebase Storage + CRUD Créations + Synchronisation Vitrine
 * Version: 2.0
 */

window.AdminCreations = (function () {

    // ─── État local ───────────────────────────────────────────────
    let storageRef = null;

    // ─── Initialisation Firebase Storage ─────────────────────────
    function initStorage() {
        try {
            if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
                storageRef = firebase.storage().ref();
                console.log('[AdminCreations] Firebase Storage prêt.');
                return true;
            }
        } catch (e) {
            console.warn('[AdminCreations] Firebase Storage non disponible :', e);
        }
        return false;
    }

    // ─── Upload d'une image vers Firebase Storage ────────────────
    async function uploadImage(file, category, domain) {
        if (!storageRef) {
            return await fileToBase64(file);
        }
        const safeCategory = category.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const safeDomain   = domain.replace(/[^a-zA-Z0-9_\-]/g, '_');
        const timestamp    = Date.now();
        const ext          = file.name.split('.').pop();
        const path         = `creations/${safeCategory}/${safeDomain}/${timestamp}_${Math.random().toString(36).slice(2)}.${ext}`;

        const ref = storageRef.child(path);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        return url;
    }

    // ─── Fallback base64 ─────────────────────────────────────────
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload  = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ─── Supprimer une image de Firebase Storage ─────────────────
    async function deleteFromStorage(imageUrl) {
        if (!storageRef || !imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) return;
        try {
            const ref = firebase.storage().refFromURL(imageUrl);
            await ref.delete();
        } catch (e) {
            console.warn('[AdminCreations] Suppression Storage :', e.message);
        }
    }

    // ─── Ajouter plusieurs créations ─────────────────────────────
    async function addCreations(files, category, domain, progressCallback) {
        const data = window.getData();
        if (!data.creations) data.creations = [];

        const results = [];
        let done = 0;

        for (const file of files) {
            try {
                const url = await uploadImage(file, category, domain);
                const title = file.name.replace(/\.[^.]+$/, '').replace(/[_\-]/g, ' ');

                const creation = {
                    id:          'cr_' + Date.now() + '_' + Math.random().toString(36).slice(2),
                    type:        'MY_CREATION',
                    title:       title,
                    service:     category,
                    domain:      domain,
                    image:       url,
                    description: '',
                    price:       '',
                    createdAt:   Date.now()
                };

                data.creations.push(creation);
                results.push(creation);
                done++;

                if (typeof progressCallback === 'function') {
                    progressCallback(done, files.length, creation);
                }
            } catch (e) {
                console.error('[AdminCreations] Erreur upload :', file.name, e);
            }
        }

        window.saveData(data);
        document.dispatchEvent(new CustomEvent('pixora-data-updated', { detail: data }));
        return results;
    }

    // ─── Supprimer une création ───────────────────────────────────
    async function deleteCreation(creationId) {
        const data = window.getData();
        const idx  = data.creations.findIndex(c => c.id === creationId);
        if (idx === -1) return false;

        const creation = data.creations[idx];
        await deleteFromStorage(creation.image);

        data.creations.splice(idx, 1);
        window.saveData(data);
        document.dispatchEvent(new CustomEvent('pixora-data-updated', { detail: data }));
        return true;
    }

    // ─── Remplacer l'image d'une création ────────────────────────
    async function replaceCreationImage(creationId, newFile) {
        const data = window.getData();
        const creation = data.creations.find(c => c.id === creationId);
        if (!creation) return null;

        await deleteFromStorage(creation.image);
        const newUrl = await uploadImage(newFile, creation.service, creation.domain);
        creation.image = newUrl;

        window.saveData(data);
        document.dispatchEvent(new CustomEvent('pixora-data-updated', { detail: data }));
        return creation;
    }

    // ─── Mettre à jour les métadonnées ────────────────────────────
    function updateCreation(creationId, fields) {
        const data = window.getData();
        const creation = data.creations.find(c => c.id === creationId);
        if (!creation) return null;
        Object.assign(creation, fields);
        window.saveData(data);
        document.dispatchEvent(new CustomEvent('pixora-data-updated', { detail: data }));
        return creation;
    }

    // ─── Obtenir les créations filtrées ──────────────────────────
    function getCreations(category, domain) {
        const data = window.getData();
        return (data.creations || []).filter(c => {
            if (c.type !== 'MY_CREATION') return false;
            if (category && category !== 'ALL' && c.service !== category) return false;
            if (domain   && domain   !== 'ALL' && c.domain  !== domain)   return false;
            return true;
        });
    }

    // ─── Initialisation ──────────────────────────────────────────
    function init() {
        // Réessayer d'init le storage après que Firebase soit prêt
        setTimeout(initStorage, 800);
        setTimeout(initStorage, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        addCreations,
        deleteCreation,
        replaceCreationImage,
        updateCreation,
        getCreations,
        initStorage
    };
})();
