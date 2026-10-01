/**
 * PIXORA STUDIO — Intégration Firebase Cloud & Synchronisation Temps Réel
 * Permet la synchronisation multi-appareils (Base de données Firestore / Realtime)
 * et le fonctionnement hors-ligne / fallback transparent sur LocalStorage.
 */

const FIREBASE_CONFIG_KEY = 'pixora_firebase_config_v1';
const FIRESTORE_COLLECTION_APP = 'pixora_studio';
const FIRESTORE_DOC_DATA = 'app_data';
const FIRESTORE_COLLECTION_ORDERS = 'pixora_orders';

window.FirebaseSync = (function() {
    let initialized = false;
    let db = null;
    let auth = null;
    let dataListeners = [];
    let ordersListeners = [];

    // Récupérer la configuration Firebase enregistrée
    function getStoredConfig() {
        try {
            const raw = localStorage.getItem(FIREBASE_CONFIG_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    // Sauvegarder la configuration Firebase
    function setStoredConfig(config) {
        if (!config) {
            localStorage.removeItem(FIREBASE_CONFIG_KEY);
        } else {
            localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
        }
        init();
    }

    // Initialisation
    function init() {
        if (typeof firebase === 'undefined') {
            console.warn('[FirebaseSync] SDK Firebase non chargé. Mode LocalStorage actif.');
            return false;
        }

        const config = getStoredConfig();
        if (!config || !config.apiKey || !config.projectId) {
            console.info('[FirebaseSync] Aucune configuration Firebase trouvée. Mode LocalStorage actif.');
            return false;
        }

        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }
            db = firebase.firestore();
            auth = firebase.auth();
            initialized = true;
            console.log('[FirebaseSync] Connecté avec succès à Firebase (' + config.projectId + ')');
            
            // Attacher les écouteurs temps réel
            attachRealtimeListeners();
            return true;
        } catch (e) {
            console.error('[FirebaseSync] Erreur lors de l\'initialisation Firebase:', e);
            initialized = false;
            return false;
        }
    }

    function isReady() {
        return initialized && db !== null;
    }

    // Écouteurs temps réel Firestore
    function attachRealtimeListeners() {
        if (!isReady()) return;

        // 1. Écoute des données globales du site
        try {
            db.collection(FIRESTORE_COLLECTION_APP).doc(FIRESTORE_DOC_DATA)
              .onSnapshot(doc => {
                  if (doc.exists) {
                      const cloudData = doc.data();
                      if (cloudData && typeof window.saveDataLocalOnly === 'function') {
                          window.saveDataLocalOnly(cloudData);
                      }
                      dataListeners.forEach(cb => {
                          try { cb(cloudData); } catch (err) { console.error(err); }
                      });
                  }
              }, err => {
                  console.warn('[FirebaseSync] Erreur écoute données:', err);
              });
        } catch (e) {
            console.warn('[FirebaseSync] Écoute data:', e);
        }

        // 2. Écoute des commandes
        try {
            db.collection(FIRESTORE_COLLECTION_ORDERS)
              .orderBy('timestamp', 'desc')
              .onSnapshot(snapshot => {
                  const orders = [];
                  snapshot.forEach(doc => {
                      orders.push({ id: doc.id, ...doc.data() });
                  });
                  ordersListeners.forEach(cb => {
                      try { cb(orders); } catch (err) { console.error(err); }
                  });
              }, err => {
                  console.warn('[FirebaseSync] Erreur écoute commandes:', err);
              });
        } catch (e) {
            console.warn('[FirebaseSync] Écoute orders:', e);
        }
    }

    // Sauvegarder les données de l'application sur Firebase
    async function syncData(appData) {
        if (!isReady()) return false;
        try {
            // Nettoyage léger si besoin
            const dataToSync = JSON.parse(JSON.stringify(appData));
            delete dataToSync.orders; // les commandes ont leur propre collection
            await db.collection(FIRESTORE_COLLECTION_APP).doc(FIRESTORE_DOC_DATA).set(dataToSync, { merge: true });
            console.log('[FirebaseSync] Données synchronisées avec succès sur le Cloud Firestore.');
            return true;
        } catch (e) {
            console.error('[FirebaseSync] Erreur lors de la synchronisation des données:', e);
            return false;
        }
    }

    // Sauvegarder une nouvelle commande
    async function saveOrder(order) {
        if (!isReady()) return false;
        try {
            const orderId = order.id || ('CMD-' + Date.now());
            const orderDoc = { ...order, id: orderId, updatedAt: Date.now() };
            await db.collection(FIRESTORE_COLLECTION_ORDERS).doc(orderId).set(orderDoc);
            console.log('[FirebaseSync] Commande enregistrée sur Firebase:', orderId);
            return true;
        } catch (e) {
            console.error('[FirebaseSync] Erreur enregistrement commande Firebase:', e);
            return false;
        }
    }

    // Mettre à jour le statut d'une commande
    async function updateOrderStatus(orderId, newStatus) {
        if (!isReady()) return false;
        try {
            await db.collection(FIRESTORE_COLLECTION_ORDERS).doc(orderId).update({
                status: newStatus,
                updatedAt: Date.now()
            });
            return true;
        } catch (e) {
            console.error('[FirebaseSync] Erreur mise à jour statut commande:', e);
            return false;
        }
    }

    // Supprimer une commande
    async function deleteOrder(orderId) {
        if (!isReady()) return false;
        try {
            await db.collection(FIRESTORE_COLLECTION_ORDERS).doc(orderId).delete();
            return true;
        } catch (e) {
            console.error('[FirebaseSync] Erreur suppression commande:', e);
            return false;
        }
    }

    // S'abonner aux changements de données
    function onDataChange(callback) {
        dataListeners.push(callback);
    }

    // S'abonner aux changements de commandes
    function onOrdersChange(callback) {
        ordersListeners.push(callback);
    }

    // Initialisation au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return {
        init,
        isReady,
        getStoredConfig,
        setStoredConfig,
        syncData,
        saveOrder,
        updateOrderStatus,
        deleteOrder,
        onDataChange,
        onOrdersChange
    };
})();
