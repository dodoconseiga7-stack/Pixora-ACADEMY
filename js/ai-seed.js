/**
 * PIXORA ACADEMY — Seeder des Créations IA Authentiques
 * Ne contient STRICTEMENT que les 5 créations IA réelles de l'utilisateur.
 * Aucun placeholder externe ni image Unsplash temporaire.
 */

(function seedAICreations() {
    const KEY = 'pixora_studio_data_v4';
    const AI_SEED_FLAG = 'pixora_ai_seeded_v5';

    if (localStorage.getItem(AI_SEED_FLAG) === 'true') return;

    const stored = localStorage.getItem(KEY);
    if (!stored) return;

    let data;
    try {
        data = JSON.parse(stored);
    } catch(e) {
        return;
    }
    if (!data.creations) data.creations = [];

    // Les 5 créations IA réelles validées
    const authenticAiCreations = [
        {
            id: 'ai_cv_restaurant',
            type: 'AI_CREATION',
            domain: 'Restaurant / Delice',
            service: 'Carte de visite',
            title: 'Carte de visite - Restaurant Gastronomique',
            image: 'assets/ai/carte_visite_restaurant.jpg',
            description: 'Exemple généré par IA — Carte de visite standard sans personnalisation fine.'
        },
        {
            id: 'c_1790028174424',
            type: 'AI_CREATION',
            domain: 'Show-biz / Evenements',
            service: 'Flyer',
            title: 'FLYERS BY IA',
            image: 'assets/ai/c_1790028174424_FLYERS_BY_IA.jpg',
            description: 'Exemple généré par IA — Flyer automatique avec texte générique.'
        },
        {
            id: 'c_1790028275537',
            type: 'AI_CREATION',
            domain: 'Restaurant / Delice',
            service: 'Affiche publicitaire',
            title: 'AFFICHE BY IA',
            image: 'assets/ai/c_1790028275537_AFFICHE_BY_IA.jpg',
            description: 'Exemple généré par IA — Affiche automatique avec défauts de composition.'
        },
        {
            id: 'c_1790028460480',
            type: 'AI_CREATION',
            domain: 'Autres',
            service: 'Affiche / Kakemono',
            title: 'KAKEMONO BY IA',
            image: 'assets/ai/c_1790028460480_KAKEMONO_BY_IA.jpg',
            description: 'Exemple généré par IA — Kakémono standardisé sans hiérarchie visuelle.'
        },
        {
            id: 'c_1790028367589',
            type: 'AI_CREATION',
            domain: 'Show-biz / Evenements',
            service: 'Visuel publicitaire',
            title: 'VISUEL BY IA',
            image: 'assets/ai/c_1790028367589_VISUEL_BY_IA.jpg',
            description: 'Exemple généré par IA — Visuel généré sans identité de marque cohérente.'
        }
    ];

    // Nettoyer d'anciens placeholders d'images externes unsplash s'ils traînent
    data.creations = data.creations.filter(c => {
        if (c.image && c.image.indexOf('images.unsplash.com') !== -1) return false;
        return true;
    });

    const existingIds = new Set(data.creations.map(c => c.id));
    authenticAiCreations.forEach(aiItem => {
        if (!existingIds.has(aiItem.id)) {
            data.creations.push(aiItem);
        } else {
            // S'assurer que le type est bien AI_CREATION
            const idx = data.creations.findIndex(c => c.id === aiItem.id);
            if (idx !== -1) {
                data.creations[idx].type = 'AI_CREATION';
            }
        }
    });

    localStorage.setItem(KEY, JSON.stringify(data));
    localStorage.setItem(AI_SEED_FLAG, 'true');

    console.log('[PIXORA STUDIO] Créations IA authentiques synchronisées.');
})();
