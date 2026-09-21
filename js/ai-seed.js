/**
 * PIXORA STUDIO — Seeder des Créations IA
 * 
 * Ce script injecte automatiquement les exemples "CRÉATION PAR IA"
 * dans le localStorage. Il ne touche JAMAIS aux créations de type
 * MY_CREATION (les vraies créations importées par le propriétaire).
 * 
 * Pour régénérer les exemples IA, rechargez simplement la page.
 */

(function seedAICreations() {
    const KEY = 'pixora_studio_data_v3';
    const AI_SEED_FLAG = 'pixora_ai_seeded_v1'; // version flag pour ne pas ré-injecter

    // Ne pas ré-injecter si déjà fait
    if (localStorage.getItem(AI_SEED_FLAG) === 'true') return;

    const stored = localStorage.getItem(KEY);
    if (!stored) return; // data.js n'a pas encore initialisé

    let data = JSON.parse(stored);

    // Retirer les anciens exemples IA s'il en existe (sans toucher MY_CREATION)
    data.creations = data.creations.filter(c => c.type !== 'AI_CREATION');

    // ================================================================
    // EXEMPLES IA À INJECTER
    // Utilisation d'images libres de droits (Unsplash/Pexels)
    // + l'image générée localement
    // ================================================================
    const aiExamples = [

        // ------ CARTE DE VISITE ------
        {
            id: 'ai_cv_restaurant',
            type: 'AI_CREATION',
            domain: 'Restaurant / Délice',
            service: 'Carte de visite',
            title: 'Carte de visite — Restaurant Gastronomique',
            image: 'assets/ai/carte_visite_restaurant.jpg',
            description: 'Exemple généré par IA — Carte de visite moderne pour restaurant.'
        },
        {
            id: 'ai_cv_salon',
            type: 'AI_CREATION',
            domain: 'Salon de coiffure',
            service: 'Carte de visite',
            title: 'Carte de visite — Salon de Coiffure',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
            description: 'Exemple généré par IA — Carte de visite élégante pour salon.'
        },
        {
            id: 'ai_cv_plombier',
            type: 'AI_CREATION',
            domain: 'Plombier',
            service: 'Carte de visite',
            title: 'Carte de visite — Artisan Plombier',
            image: 'https://images.unsplash.com/photo-1601629665203-f9f2b8d07db4?w=800&q=80',
            description: 'Exemple généré par IA — Carte de visite professionnelle pour artisan.'
        },

        // ------ FLYER ------
        {
            id: 'ai_flyer_boulangerie',
            type: 'AI_CREATION',
            domain: 'Boulangerie / Pâtisserie',
            service: 'Flyer',
            title: 'Flyer — Boulangerie Artisanale',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
            description: 'Exemple généré par IA — Flyer promotionnel pour boulangerie.'
        },
        {
            id: 'ai_flyer_fastfood',
            type: 'AI_CREATION',
            domain: 'Fast-food',
            service: 'Flyer',
            title: 'Flyer — Fast Food Promotion',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
            description: 'Exemple généré par IA — Flyer avec offre spéciale pour fast food.'
        },
        {
            id: 'ai_flyer_fashion',
            type: 'AI_CREATION',
            domain: 'Fashion',
            service: 'Flyer',
            title: 'Flyer — Boutique Fashion',
            image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
            description: 'Exemple généré par IA — Flyer tendance pour boutique de mode.'
        },

        // ------ AFFICHE PUBLICITAIRE ------
        {
            id: 'ai_affiche_coiffure',
            type: 'AI_CREATION',
            domain: 'Salon de coiffure',
            service: 'Affiche publicitaire',
            title: 'Affiche — Salon de Coiffure Prestige',
            image: 'https://images.unsplash.com/photo-1560066984-138daaa6bb08?w=800&q=80',
            description: 'Exemple généré par IA — Affiche professionnelle et accrocheuse pour salon.'
        },
        {
            id: 'ai_affiche_restaurant',
            type: 'AI_CREATION',
            domain: 'Restaurant / Délice',
            service: 'Affiche publicitaire',
            title: 'Affiche — Restaurant Spécialités',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
            description: 'Exemple généré par IA — Affiche grand format pour restaurant.'
        },
        {
            id: 'ai_affiche_market',
            type: 'AI_CREATION',
            domain: 'Market',
            service: 'Affiche publicitaire',
            title: 'Affiche — Supermarché Promotions',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
            description: 'Exemple généré par IA — Affiche promotionnelle pour marché ou supermarché.'
        },

        // ------ VISUEL PUBLICITAIRE ------
        {
            id: 'ai_visuel_fashion',
            type: 'AI_CREATION',
            domain: 'Fashion',
            service: 'Visuel publicitaire',
            title: 'Visuel — Collection Fashion Été',
            image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
            description: 'Exemple généré par IA — Visuel réseaux sociaux pour marque de mode.'
        },
        {
            id: 'ai_visuel_coiffure',
            type: 'AI_CREATION',
            domain: 'Salon de coiffure',
            service: 'Visuel publicitaire',
            title: 'Visuel — Offre Coiffure Spéciale',
            image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
            description: 'Exemple généré par IA — Visuel Instagram/Facebook pour salon de coiffure.'
        },
        {
            id: 'ai_visuel_boulangerie',
            type: 'AI_CREATION',
            domain: 'Boulangerie / Pâtisserie',
            service: 'Visuel publicitaire',
            title: 'Visuel — Boulangerie Pâtisserie',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
            description: 'Exemple généré par IA — Visuel appétissant pour pâtisserie.'
        },

        // ------ KAKÉMONO ------
        {
            id: 'ai_kakemono_coiffure',
            type: 'AI_CREATION',
            domain: 'Salon de coiffure',
            service: 'Affiche / Kakémono',
            title: 'Kakémono — Salon "Élégance"',
            image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80',
            description: 'Exemple généré par IA — Kakémono vertical professionnel pour salon.'
        },
        {
            id: 'ai_kakemono_showbiz',
            type: 'AI_CREATION',
            domain: 'Show-biz / Événements',
            service: 'Affiche / Kakémono',
            title: 'Kakémono — Soirée Événementielle',
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
            description: 'Exemple généré par IA — Kakémono pour événement ou concert.'
        },

        // ------ ÉTIQUETTE ------
        {
            id: 'ai_etiquette_alimentaire',
            type: 'AI_CREATION',
            domain: 'Boulangerie / Pâtisserie',
            service: 'Étiquette',
            title: 'Étiquette — Produit Alimentaire Bio',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
            description: 'Exemple généré par IA — Étiquette propre et réaliste pour produit alimentaire.'
        },
        {
            id: 'ai_etiquette_cosmetique',
            type: 'AI_CREATION',
            domain: 'Salon de coiffure',
            service: 'Étiquette',
            title: 'Étiquette — Produit Cosmétique',
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
            description: 'Exemple généré par IA — Étiquette élégante pour produit cosmétique.'
        },

        // ------ LOGO ------
        {
            id: 'ai_logo_restaurant',
            type: 'AI_CREATION',
            domain: 'Restaurant / Délice',
            service: 'Logo',
            title: 'Logo — Restaurant Gastronomique',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
            description: 'Exemple généré par IA — Logo professionnel pour restaurant.'
        },
        {
            id: 'ai_logo_fashion',
            type: 'AI_CREATION',
            domain: 'Fashion',
            service: 'Logo',
            title: 'Logo — Marque Fashion',
            image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
            description: 'Exemple généré par IA — Logo minimaliste pour marque de mode.'
        },
        {
            id: 'ai_logo_electricite',
            type: 'AI_CREATION',
            domain: 'Électricité / Bâtiment',
            service: 'Logo',
            title: 'Logo — Entreprise Bâtiment',
            image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
            description: 'Exemple généré par IA — Logo sérieux pour entreprise du bâtiment.'
        }
    ];

    // Ajouter les exemples IA à la fin de la liste
    data.creations = [...data.creations, ...aiExamples];
    localStorage.setItem(KEY, JSON.stringify(data));
    localStorage.setItem(AI_SEED_FLAG, 'true');

    console.log('[PIXORA STUDIO] Exemples IA injectés avec succès :', aiExamples.length, 'créations.');
})();
