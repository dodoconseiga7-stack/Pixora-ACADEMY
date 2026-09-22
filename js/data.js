const STORAGE_KEY = 'pixora_studio_data_v3';

// Emojis pour les cartes de services (icône de secours quand aucune image n'est uploadée)
const SERVICE_ICONS = {
    'Carte de visite': '🪪',
    'Flyer': '📄',
    'Affiche publicitaire': '🖼️',
    'Visuel publicitaire': '📸',
    'Affiche / Kakémono': '🏷️',
    'Étiquette': '🏷️',
    'Logo': '✨',
    'Autres': '📦'
};

const defaultData = {
    settings: {
        whatsappNumber: '+226 03 24 95 48',
        logoUrl: ''   // vide = affiche le texte "PIXORA STUDIO" en grand
    },
    serviceImages: {
        'Carte de visite':      'assets/images/services/business-cards/business-card-01.jpg',
        'Flyer':                'assets/images/services/flyers/flyer-01.jpg',
        'Affiche publicitaire': 'assets/images/services/posters/poster-01.jpg',
        'Visuel publicitaire':  'assets/images/services/social-media/social-media-01.jpg',
        'Affiche / Kakémono':   'assets/images/services/kakemono/kakemono-01.jpg',
        'Étiquette':            'assets/images/services/labels/label-01.jpg',
        'Logo':                 'assets/images/services/logos/logo-01.jpg',
        'Autres':               'assets/images/services/branding/branding-01.jpg'
    },
    domains: [
        'Plombier',
        'Restaurant / Délice',
        'Fashion',
        'Market',
        'Fast-food',
        'Boulangerie / Pâtisserie',
        'Électricité / Bâtiment',
        'Salon de coiffure',
        'Show-biz / Événements',
        'Autres'
    ],
    services: [
        'Carte de visite',
        'Flyer',
        'Affiche publicitaire',
        'Visuel publicitaire',
        'Affiche / Kakémono',
        'Étiquette',
        'Logo',
        'Autres'
    ],
    prices: {
        'Carte de visite':      { basic: 5000,  standard: 7500,  premium: 10000 },
        'Flyer':                { basic: 5000,  standard: 7500,  premium: 10000 },
        'Affiche publicitaire': { basic: 5000,  standard: 8000,  premium: 12000 },
        'Visuel publicitaire':  { basic: 5000,  standard: 7000,  premium: 10000 },
        'Affiche / Kakémono':   { basic: 8000,  standard: 12000, premium: 15000 },
        'Étiquette':            { basic: 5000,  standard: 7500,  premium: 10000 },
        'Logo':                 { basic: 10000, standard: 15000, premium: 25000 },
        'Autres':               { basic: 5000,  standard: 10000, premium: 15000 }
    },
    creations: []
};

function initData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    } else {
        let parsed = JSON.parse(stored);
        let updated = false;

        if (!parsed.serviceImages) {
            parsed.serviceImages = defaultData.serviceImages;
            updated = true;
        } else {
            Object.keys(defaultData.serviceImages).forEach(key => {
                if (!parsed.serviceImages[key] || parsed.serviceImages[key] === '') {
                    parsed.serviceImages[key] = defaultData.serviceImages[key];
                    updated = true;
                }
            });
        }

        if (updated) localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
}

function getData() {
    initData();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ============================================================
// INITIALISATION : charger les données de déploiement si disponibles
// Le fichier deploy-data.json est généré depuis l'admin (bouton Export)
// et déposé à la racine du projet avant déploiement.
// ============================================================
(function loadDeployData() {
    // Ne tente pas de fetch en local (file://)
    if (window.location.protocol === 'file:') {
        initData();
        return;
    }

    fetch('deploy-data.json?v=' + Date.now())
        .then(r => {
            if (!r.ok) throw new Error('No deploy-data.json');
            return r.json();
        })
        .then(deployData => {
            // Nettoyer les métadonnées d'export
            delete deployData._version;
            delete deployData._note;
            delete deployData._exported_at;

            // Si le fichier de déploiement contient des données personnalisées
            // (logo ou créations), on les utilise comme données de référence
            const deployHasCustom = (deployData.creations && deployData.creations.length > 0)
                                 || (deployData.settings && deployData.settings.logoUrl);

            if (deployHasCustom) {
                saveData(deployData);
                console.log('[Pixora] ✅ Données personnalisées chargées depuis deploy-data.json');
            } else {
                initData();
            }
        })
        .catch(() => {
            // Pas de fichier deploy-data.json → comportement normal (localStorage)
            initData();
        });
})();
