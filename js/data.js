const STORAGE_KEY = 'pixora_studio_data_v5';

const SERVICE_ICONS = {
    'Carte de visite': 'ðŸªª',
    'Flyer': 'ðŸ“„',
    'Affiche publicitaire': 'ðŸ–¼ï¸',
    'Visuel publicitaire': 'ðŸ“¸',
    'Affiche / KakÃ©mono': 'ðŸ·ï¸',
    'Affiche / Kakemono': 'ðŸ·ï¸',
    'Ã‰tiquette': 'ðŸ·ï¸',
    'Etiquette': 'ðŸ·ï¸',
    'Logo': 'âœ¨',
    'Autres': 'ðŸ“¦'
};

const defaultData = {"domains":["Plomberie","Typographie","Fast-food","Carte de visite","Affiche publicitaire","Etiquette","Flyer","Kakemono","Logo","Packaging","Restaurant / Delice","Fashion","Market","Boulangerie / Patisserie","Electricite / Batiment","Salon de coiffure","Show-biz / Evenements","Autres"],"services":["Carte de visite","Flyer","Affiche publicitaire","Visuel publicitaire","Affiche / Kakemono","Etiquette","Logo","Autres"],"prices":{"Carte de visite":{"basic":5000,"standard":7500,"premium":10000},"Flyer":{"basic":5000,"standard":7500,"premium":10000},"Affiche publicitaire":{"basic":5000,"standard":8000,"premium":12000},"Visuel publicitaire":{"basic":5000,"standard":7000,"premium":10000},"Affiche / Kakemono":{"basic":8000,"standard":12000,"premium":15000},"Affiche / KakÃ©mono":{"basic":8000,"standard":12000,"premium":15000},"Etiquette":{"basic":5000,"standard":7500,"premium":10000},"Ã‰tiquette":{"basic":5000,"standard":7500,"premium":10000},"Logo":{"basic":10000,"standard":15000,"premium":25000},"Autres":{"basic":5000,"standard":10000,"premium":15000}},"settings":{"phoneNumber":"+226 03 24 95 48","whatsappNumber":"+226 03 24 95 48","reservationNumber":"+226 03 24 95 48","email":"contact@pixorastudio.com","address":"Ouagadougou, Burkina Faso","adminPassword":"PIXORA","logoUrl":"assets/images/logo.png","heroVideo":{"name":"1007.mp4","url":"assets/videos/hero-video.mp4","type":"video/mp4","size":154846495,"updatedAt":1728309421000,"isLocal":false},"heroVideoUrl":"assets/videos/hero-video.mp4","texts":{"heroTitle":"BIENVENUE CHEZ PIXORA ACADEMY","heroSubtitle":"Des crÃ©ations graphiques pensÃ©es pour donner une vraie image professionnelle Ã  votre activitÃ©.","servicesTitle":"NOS SERVICES","btnCreations":"VOIR TOUTES MES CRÃ‰ATIONS","btnCommander":"COMMANDER","diffTitle":"LA DIFFÃ‰RENCE","diffSubtitle":"Voyez par vous-mÃªme la diffÃ©rence entre une crÃ©ation artisanale maÃ®trisÃ©e et une image gÃ©nÃ©rÃ©e automatiquement.","creationsTitle":"MES CRÃ‰ATIONS","tarifsTitle":"SERVICES \u0026 TARIFS","tarifsSubtitle":"Chaque crÃ©ation est disponible en trois niveaux adaptÃ©s Ã  votre budget et Ã  vos besoins.","contactTitle":"UNE QUESTION ? CONTACTEZ-NOUS","footerText":"Â© 2026 Pixora Academy - Studio de crÃ©ation graphique professionnelle. Tous droits rÃ©servÃ©s."}},"serviceImages":{"Carte de visite":"assets/images/services/custom/carte_de_visite.jpg","Flyer":"assets/images/services/custom/flyer.jpg","Affiche publicitaire":"assets/images/services/custom/affiche_publicitaire.png","Visuel publicitaire":"assets/images/services/custom/visuel_publicitaire.jpg","Affiche / Kakemono":"assets/images/services/custom/kakemono.jpg","Affiche / KakÃ©mono":"assets/images/services/custom/kakemono.jpg","Etiquette":"assets/images/services/custom/etiquette.jpg","Ã‰tiquette":"assets/images/services/custom/etiquette.jpg","Logo":"assets/images/services/custom/logo.jpg","Autres":"assets/images/services/branding/branding-01.jpg"},"creations":[{"id":"c_1790025652563","type":"MY_CREATION","domain":"Electricite / Batiment","service":"Logo","title":"LOGO BY PXORA","price":"35000","createdAt":1727014052563,"image":"assets/images/creations/c_1790025652563_LOGO_BY_PXORA.jpg","description":"CrÃ©ation graphique professionnelle pour entreprise du bÃ¢timent et Ã©lectricitÃ©."},{"id":"c_1790026103116","type":"MY_CREATION","domain":"Restaurant / Delice","service":"Carte de visite","title":"CARTE DE VISITE BY PIXORA","price":"15000","createdAt":1727014503116,"image":"assets/images/creations/c_1790026103116_CARTE_DE_VISITE_BY_PIXORA.jpg","description":"Carte de visite personnalisÃ©e, finitions premium et typographie soignÃ©e."},{"id":"c_1790026442622","type":"MY_CREATION","domain":"Show-biz / Evenements","service":"Flyer","title":"FLYERS BY PIXORA","price":"20000","createdAt":1727014842622,"image":"assets/images/creations/c_1790026442622_FLYERS_BY_PIXORA.jpg","description":"Flyer promotionnel percutant pour concert et Ã©vÃ©nement show-biz."},{"id":"c_1790025987970","type":"MY_CREATION","domain":"Plombier","service":"Affiche publicitaire","title":"AFFICHE BY PIXORA","price":"25000","createdAt":1727014387970,"image":"assets/images/creations/c_1790025987970_AFFICHE_BY_PIXORA.jpg","description":"Affiche commerciale grand format avec mise en page structurÃ©e."},{"id":"c_1790025810802","type":"MY_CREATION","domain":"Salon de coiffure","service":"Affiche / Kakemono","title":"KAKEMONO BY PIXORA","price":"30000","createdAt":1727014210802,"image":"assets/images/creations/c_1790025810802_KAKEMONO_BY_PIXORA.jpg","description":"KakÃ©mono vertical haute visibilitÃ© pour salon de coiffure et institut."},{"id":"c_1790025878710","type":"MY_CREATION","domain":"Fashion","service":"Visuel publicitaire","title":"VISUEL BY PIXORA","price":"18000","createdAt":1727014278710,"image":"assets/images/creations/c_1790025878710_VISUEL_BY_PIXORA.jpg","description":"Visuel publicitaire rÃ©seaux sociaux haute conversion pour marque de mode."},{"id":"c_1790026244397","type":"MY_CREATION","domain":"Restaurant / Delice","service":"Etiquette","title":"ETIQUETTE BY PIXORA","price":"15000","createdAt":1727014644397,"image":"assets/images/creations/c_1790026244397_ETIQUETTE_BY_PIXORA.jpg","description":"Ã‰tiquette produit raffinÃ©e pour packaging alimentaire et bouteilles."},{"id":"c_1790027418342","type":"MY_CREATION","domain":"Autres","service":"Visuel publicitaire","title":"AUTRE BY PIXORA","price":"20000","createdAt":1727015818342,"image":"assets/images/creations/c_1790027418342_AUTRE_BY_PIXORA.jpg","description":"Visuel publicitaire sur mesure adaptÃ© Ã  tous supports marketing."},{"id":"ai_cv_restaurant","type":"AI_CREATION","domain":"Restaurant / Delice","service":"Carte de visite","title":"Carte de visite - Restaurant Gastronomique","price":"","createdAt":1727014000000,"image":"assets/ai/carte_visite_restaurant.jpg","description":"Exemple gÃ©nÃ©rÃ© par IA - Carte de visite standard sans personnalisation fine."},{"id":"c_1790028174424","type":"AI_CREATION","domain":"Show-biz / Evenements","service":"Flyer","title":"FLYERS BY IA","price":"","createdAt":1727016574424,"image":"assets/ai/c_1790028174424_FLYERS_BY_IA.jpg","description":"Exemple gÃ©nÃ©rÃ© par IA - Flyer automatique avec texte gÃ©nÃ©rique."},{"id":"c_1790028275537","type":"AI_CREATION","domain":"Restaurant / Delice","service":"Affiche publicitaire","title":"AFFICHE BY IA","price":"","createdAt":1727016675537,"image":"assets/ai/c_1790028275537_AFFICHE_BY_IA.jpg","description":"Exemple gÃ©nÃ©rÃ© par IA - Affiche automatique avec dÃ©fauts de composition."},{"id":"c_1790028460480","type":"AI_CREATION","domain":"Autres","service":"Affiche / Kakemono","title":"KAKEMONO BY IA","price":"","createdAt":1727016860480,"image":"assets/ai/c_1790028460480_KAKEMONO_BY_IA.jpg","description":"Exemple gÃ©nÃ©rÃ© par IA - KakÃ©mono standardisÃ© sans hiÃ©rarchie visuelle."},{"id":"c_1790028367589","type":"AI_CREATION","domain":"Show-biz / Evenements","service":"Visuel publicitaire","title":"VISUEL BY IA","price":"","createdAt":1727016767589,"image":"assets/ai/c_1790028367589_VISUEL_BY_IA.jpg","description":"Exemple gÃ©nÃ©rÃ© par IA - Visuel gÃ©nÃ©rÃ© sans identitÃ© de marque cohÃ©rente."}]};

try {
    if (typeof window !== 'undefined' && window.location && window.location.search.indexOf('reset=1') !== -1) {
        localStorage.removeItem(STORAGE_KEY);
        console.log('[PIXORA] Reset localStorage demandÃ© via URL.');
    }
} catch(e) {}

function initData() {
    try {
        if (localStorage.getItem('pixora_studio_data_v4')) localStorage.removeItem('pixora_studio_data_v4');
        if (localStorage.getItem('pixora_studio_data_v3')) localStorage.removeItem('pixora_studio_data_v3');
        if (localStorage.getItem('pixora_studio_data_v2')) localStorage.removeItem('pixora_studio_data_v2');
        if (localStorage.getItem('pixora_studio_data')) localStorage.removeItem('pixora_studio_data');
    } catch(e) {}

    let stored;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) { stored = null; }

    if (!stored) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        } catch (e) {
            console.warn('[PIXORA] Quota localStorage dÃ©passÃ© - defaultData utilisÃ© en mÃ©moire.');
        }
        return;
    }

    let parsed;
    try {
        parsed = JSON.parse(stored);
    } catch (e) {
        console.warn('[PIXORA] localStorage corrompu - rÃ©initialisation depuis defaultData:', e);
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        } catch (e2) {}
        return;
    }

    {
        let updated = false;

        // Migration : domaines
        if (!parsed.domains || parsed.domains.length === 0) {
            parsed.domains = defaultData.domains;
            updated = true;
        }

        // Migration : services
        if (!parsed.services || parsed.services.length === 0) {
            parsed.services = defaultData.services;
            updated = true;
        }

        // Migration : prices
        if (!parsed.prices || Object.keys(parsed.prices).length === 0) {
            parsed.prices = defaultData.prices;
            updated = true;
        }

        // Migration : serviceImages
        if (!parsed.serviceImages || Object.keys(parsed.serviceImages).length < 7) {
            parsed.serviceImages = defaultData.serviceImages;
            updated = true;
        }

        // Migration : crÃ©ations
        if (defaultData.creations && defaultData.creations.length > 0) {
            if (!parsed.creations || parsed.creations.length === 0) {
                parsed.creations = defaultData.creations;
                updated = true;
            } else {
                const currentIds = new Set(parsed.creations.map(c => c.id));
                defaultData.creations.forEach(defC => {
                    if (!currentIds.has(defC.id)) {
                        parsed.creations.push(defC);
                        updated = true;
                    }
                });
            }
        }

        if ((!parsed.settings || !parsed.settings.logoUrl) && defaultData.settings && defaultData.settings.logoUrl) {
            if (!parsed.settings) parsed.settings = {};
            parsed.settings.logoUrl = defaultData.settings.logoUrl;
            updated = true;
        }

        if (!parsed.settings) parsed.settings = {};
        if (!parsed.settings.heroVideo && !parsed.settings.heroVideoUrl) {
            parsed.settings.heroVideo = defaultData.settings.heroVideo;
            parsed.settings.heroVideoUrl = defaultData.settings.heroVideoUrl;
            updated = true;
        }

        if (!parsed.settings.adminPassword || parsed.settings.adminPassword === 'admin') {
            parsed.settings.adminPassword = 'PIXORA';
            updated = true;
        }

        if (updated) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch(e) {}
        }
    }
}

const ORDERS_STORAGE_KEY = 'pixora_studio_orders_v1';

function getData() {
    try {
        initData();
        let stored;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch(e) {}
        if (stored) {
            try { return JSON.parse(stored); } catch(e) {}
        }
    } catch (e) {
        console.warn('[PIXORA] Erreur getData:', e);
    }
    return JSON.parse(JSON.stringify(defaultData));
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (window.FirebaseSync && typeof window.FirebaseSync.syncData === 'function') {
        window.FirebaseSync.syncData(data);
    }
}

function saveDataLocalOnly(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
