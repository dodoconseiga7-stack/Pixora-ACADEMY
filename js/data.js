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
        // Clé = nom du service, valeur = URL de l'image de couverture
        'Carte de visite': '',
        'Flyer': '',
        'Affiche publicitaire': '',
        'Visuel publicitaire': '',
        'Affiche / Kakémono': '',
        'Étiquette': '',
        'Logo': '',
        'Autres': ''
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
        // Migration : ajouter serviceImages si absent (upgrade depuis ancienne version)
        let parsed = JSON.parse(stored);
        let updated = false;
        if (!parsed.serviceImages) {
            parsed.serviceImages = defaultData.serviceImages;
            updated = true;
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

initData();
