/**
 * PIXORA STUDIO — Data Manager & Store Extension
 * Gère les paramètres avancés (textes, contacts, images de section, services étendus),
 * la gestion des commandes (CRUD, statut, fiches clients),
 * l'authentification sécurisée de l'administration,
 * et la synchronisation avec Firebase / Cloud Firestore.
 */

(function() {
    const ORDERS_STORAGE_KEY = 'pixora_studio_orders_v1';

    const originalGetData = window.getData;
    const originalSaveData = window.saveData;

    // Données par défaut pour les textes du site
    const defaultTexts = {
        heroTitle: "BIENVENUE CHEZ PIXORA ACADEMY",
        heroSubtitle: "Des créations graphiques pensées pour donner une vraie image professionnelle à votre activité.",
        servicesTitle: "NOS SERVICES",
        btnCreations: "VOIR TOUTES MES CRÉATIONS",
        btnCommander: "COMMANDER",
        diffTitle: "LA DIFFÉRENCE",
        diffSubtitle: "Voyez par vous-même la différence entre une création artisanale et une image générée automatiquement.",
        creationsTitle: "MES CRÉATIONS",
        tarifsTitle: "SERVICES & TARIFS",
        tarifsSubtitle: "Chaque création est disponible en trois niveaux adaptés à votre budget et à vos besoins.",
        contactTitle: "UNE QUESTION ? CONTACTEZ-NOUS",
        footerText: "© 2026 Pixora Academy — Studio de création graphique professionnelle. Tous droits réservés."
    };

    // Extension de getData
    window.getData = function() {
        const d = originalGetData ? originalGetData() : (window.defaultData || {});
        
        if (!d.settings) d.settings = {};
        if (!d.settings.whatsappNumber) d.settings.whatsappNumber = '+226 03 24 95 48';
        if (!d.settings.phoneNumber) d.settings.phoneNumber = d.settings.whatsappNumber;
        if (!d.settings.reservationNumber) d.settings.reservationNumber = d.settings.whatsappNumber;
        if (!d.settings.address) d.settings.address = 'Ouagadougou, Burkina Faso';
        if (!d.settings.email) d.settings.email = 'contact@pixorastudio.com';

        // Textes
        if (!d.settings.texts) {
            d.settings.texts = { ...defaultTexts };
        } else {
            // Compléter avec les textes par défaut si un champ manque
            for (const k in defaultTexts) {
                if (typeof d.settings.texts[k] === 'undefined') {
                    d.settings.texts[k] = defaultTexts[k];
                }
            }
        }

        // Images de présentation / bannières
        if (!d.settings.images) {
            d.settings.images = {
                heroBgUrl: '',
                contactBgUrl: '',
                extraImages: []
            };
        }

        // Métadonnées des services (masqué / actif, descriptions spécifiques, catégories)
        if (!d.servicesMeta) d.servicesMeta = {};

        // Préservation stricte de toutes les créations authentiques de l'utilisateur
        if (window.defaultData && Array.isArray(window.defaultData.creations) && window.defaultData.creations.length > 0) {
            if (!Array.isArray(d.creations) || d.creations.length === 0) {
                d.creations = [...window.defaultData.creations];
            } else {
                const currentIds = new Set(d.creations.map(c => c.id));
                window.defaultData.creations.forEach(defC => {
                    if (!currentIds.has(defC.id)) {
                        d.creations.unshift(defC);
                    }
                });
            }
        }

        // ── Vidéo hero par défaut ──────────────────────────────────────
        // Si aucune vidéo n'est configurée dans localStorage,
        // on pointe automatiquement vers la vidéo locale du projet.
        if (!d.settings.heroVideo && !d.settings.heroVideoUrl) {
            d.settings.heroVideo = {
                url: 'assets/videos/hero-video.mp4',
                name: '1007.mp4',
                size: 154846495,
                type: 'video/mp4',
                updatedAt: 1728309421000,
                isLocal: false
            };
            d.settings.heroVideoUrl = 'assets/videos/hero-video.mp4';
        }

        // ── Logo par défaut depuis defaultData ─────────────────────────
        if (!d.settings.logoUrl && window.defaultData && window.defaultData.settings && window.defaultData.settings.logoUrl) {
            d.settings.logoUrl = window.defaultData.settings.logoUrl;
        }

        // ── Prix et Images de services par défaut ──────────────────────
        if (!d.prices && window.defaultData && window.defaultData.prices) {
            d.prices = JSON.parse(JSON.stringify(window.defaultData.prices));
        }
        if ((!d.serviceImages || Object.keys(d.serviceImages).length < 7) && window.defaultData && window.defaultData.serviceImages) {
            d.serviceImages = JSON.parse(JSON.stringify(window.defaultData.serviceImages));
        }

        return d;
    };

    // Extension de saveData
    window.saveData = function(data) {
        if (originalSaveData) originalSaveData(data);
        // Synchroniser avec Firebase si disponible
        if (window.FirebaseSync && typeof window.FirebaseSync.syncData === 'function') {
            window.FirebaseSync.syncData(data);
        }
    };

    window.saveDataLocalOnly = function(data) {
        if (originalSaveData) originalSaveData(data);
    };

    // ============================================================
    // GESTION DES COMMANDES (Orders API)
    // ============================================================
    window.getOrders = function() {
        try {
            const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    };

    window.saveOrders = function(orders) {
        try {
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        } catch (e) {
            console.error('Erreur sauvegarde commandes:', e);
        }
    };

    window.addOrder = function(order) {
        const orders = window.getOrders();
        const now = new Date();
        const orderId = order.id || ('CMD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000));
        
        const fullOrder = {
            id: orderId,
            date: order.date || now.toLocaleDateString('fr-FR'),
            time: order.time || now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            timestamp: order.timestamp || Date.now(),
            client: {
                nom: (order.client && order.client.nom) || '',
                prenom: (order.client && order.client.prenom) || '',
                telephone: (order.client && (order.client.telephone || order.client.tel)) || '',
                adresse: (order.client && order.client.adresse) || ''
            },
            projet: {
                domaine: (order.projet && order.projet.domaine) || '',
                logoExistant: (order.projet && (order.projet.logoExistant || order.projet.logo)) || 'Non'
            },
            services: Array.isArray(order.services) ? order.services : [],
            total: Number(order.total) || 0,
            message: order.message || '',
            details: order.details || '',
            status: order.status || 'Nouvelle', // Nouvelle | En attente | En cours | Terminée | Annulée
            history: order.history || [
                { status: 'Nouvelle', date: now.toLocaleString('fr-FR'), note: 'Commande créée par le client' }
            ]
        };

        orders.unshift(fullOrder);
        window.saveOrders(orders);

        // Envoyer à Firebase Cloud Firestore si disponible
        if (window.FirebaseSync && typeof window.FirebaseSync.saveOrder === 'function') {
            window.FirebaseSync.saveOrder(fullOrder);
        }

        document.dispatchEvent(new CustomEvent('pixora-order-created', { detail: fullOrder }));
        return fullOrder;
    };

    window.updateOrderStatus = function(orderId, newStatus, note = '') {
        const orders = window.getOrders();
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
            orders[idx].status = newStatus;
            if (!orders[idx].history) orders[idx].history = [];
            orders[idx].history.push({
                status: newStatus,
                date: new Date().toLocaleString('fr-FR'),
                note: note || `Statut passé à : ${newStatus}`
            });
            window.saveOrders(orders);

            if (window.FirebaseSync && typeof window.FirebaseSync.updateOrderStatus === 'function') {
                window.FirebaseSync.updateOrderStatus(orderId, newStatus);
            }
            document.dispatchEvent(new CustomEvent('pixora-orders-updated', { detail: orders }));
            return true;
        }
        return false;
    };

    window.deleteOrder = function(orderId) {
        let orders = window.getOrders();
        orders = orders.filter(o => o.id !== orderId);
        window.saveOrders(orders);

        if (window.FirebaseSync && typeof window.FirebaseSync.deleteOrder === 'function') {
            window.FirebaseSync.deleteOrder(orderId);
        }
        document.dispatchEvent(new CustomEvent('pixora-orders-updated', { detail: orders }));
        return true;
    };


    // Écoute temps réel Firebase pour synchroniser les commandes
    if (window.FirebaseSync && typeof window.FirebaseSync.onOrdersChange === 'function') {
        window.FirebaseSync.onOrdersChange((cloudOrders) => {
            if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
                window.saveOrders(cloudOrders);
                document.dispatchEvent(new CustomEvent('pixora-orders-updated', { detail: cloudOrders }));
            }
        });
    }

})();
