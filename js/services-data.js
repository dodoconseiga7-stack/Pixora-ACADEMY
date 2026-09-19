/**
 * PIXORA STUDIO — Données Officielles des 18 Services & Produits
 * Numéro WhatsApp officiel : +226 03 24 95 48
 * Chemins d'images normalisés dans public/images/services/<sous-dossier>/
 */

const PIXORA_CONFIG = {
  studioName: "PIXORA STUDIO",
  tagline: "Studio de Conception Graphique, Communication Visuelle & Impression",
  whatsappNumber: "22603249548",
  whatsappDisplay: "+226 03 24 95 48",
  logoPath: "public/images/brand/logo.svg",
  faviconPath: "public/images/brand/favicon.svg"
};

const SERVICES_DATA = [
  {
    id: "business-cards",
    title: "Cartes de Visite",
    category: "print",
    categoryLabel: "Impression Papier",
    shortDesc: "Cartes de visite professionnelles et modernes avec finitions soignées, papiers épais et tranches soignées.",
    fullDesc: "Créez une première impression percutante auprès de vos partenaires et clients avec nos cartes de visite professionnelles. Nous proposons un choix rigoureux de papiers épais (couché mat 350g, 400g ou texturé), avec finitions dorure, vernis sélectif ou pelliculage Soft Touch pour valoriser votre statut.",
    image: "public/images/services/business-cards/business-card-01.jpg",
    specs: {
      formats: "85 x 55 mm, 90 x 50 mm ou dimensions personnalisées",
      papier: "Couché mat 350g/400g, Coton ou Papier texturé de création",
      finitions: "Pelliculage mat/brillant/Soft Touch, Vernis sélectif, Dorure",
      delai: "Délais rapides sur mesure"
    },
    badge: "Indispensable Pro",
    tags: ["Papier Épais", "Finition Soignée", "Format Standard & Sur-Mesure"],
    whatsappMessage: "Bonjour, je souhaite commander des cartes de visite."
  },
  {
    id: "flyers",
    title: "Flyers",
    category: "print",
    categoryLabel: "Impression Papier",
    shortDesc: "Supports promotionnels percutants pour vos lancements, offres spéciales et événements professionnels.",
    fullDesc: "Diffusez efficacement votre message commercial grâce à nos flyers haute qualité. Conception graphique attrayante, mise en valeur claire de votre offre et impression haute définition sur papier couché mat ou brillant.",
    image: "public/images/services/flyers/flyer-01.jpg",
    specs: {
      formats: "A6 (105x148mm), A5 (148x210mm), format DL (100x210mm)",
      papier: "Couché 135g, 170g, 250g ou 350g cartonné",
      finitions: "Vernis protecteur, Pelliculage mat ou brillant",
      delai: "Tirage rapide adapté à vos urgences"
    },
    badge: "Haute Visibilité",
    tags: ["Formats A5/A6", "Impression Recto/Verso", "Grand Tirage"],
    whatsappMessage: "Bonjour, je souhaite commander un flyer."
  },
  {
    id: "posters",
    title: "Affiches Publicitaires",
    category: "signage",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Affiches publicitaires grand format et urbaines avec encres durables et haute résolution d'impression.",
    fullDesc: "Captez le regard dans l'espace public et valorisez vos campagnes d'affichage. Nos affiches publicitaires sont imprimées en haute définition avec des encres résistantes pour affichage intérieur, vitrine ou mobilier urbain.",
    image: "public/images/services/posters/poster-01.jpg",
    specs: {
      formats: "A3, A2, A1, A0, Abribus 120x176cm ou formats libres",
      papier: "Papier couché 150g satiné, Papier dos bleu, Backlight pour caissons",
      finitions: "Traitement anti-reflet, Encres résistantes",
      delai: "Conception & impression express"
    },
    badge: "Grand Format",
    tags: ["Urbain & Vitrine", "Haute Résolution", "Couleurs Éclatantes"],
    whatsappMessage: "Bonjour, je souhaite commander une affiche publicitaire."
  },
  {
    id: "social-media",
    title: "Visuels Professionnels pour Réseaux Sociaux",
    category: "branding",
    categoryLabel: "Branding & Digital",
    shortDesc: "Visuels, carrousels et bannières optimisés pour développer votre notoriété sur les réseaux sociaux.",
    fullDesc: "Renforcez votre image de marque sur Facebook, Instagram, LinkedIn et TikTok avec des visuels au design soigné et impactant. Nous concevons des publications, stories, bannières et carrousels qui captivent votre audience.",
    image: "public/images/services/social-media/social-media-01.jpg",
    specs: {
      formats: "Formats optimisés carré (1:1), portrait (4:5) et story (9:16)",
      papier: "Livrables numériques HD (PNG, JPG, MP4)",
      finitions: "Fichiers sources et déclinaisons prêtes à poster",
      delai: "Réactivité et packs récurrents"
    },
    badge: "Impact Digital",
    tags: ["Instagram & Facebook", "Carrousels", "Bannières Pro"],
    whatsappMessage: "Bonjour, je souhaite des visuels professionnels pour mes réseaux sociaux."
  },
  {
    id: "plaques",
    title: "Plaques Publicitaires et Professionnelles",
    category: "signage",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Plaques murales professionnelles en plexiglas, laiton brossé ou aluminium pour cabinets et entreprises.",
    fullDesc: "Indiquez l'entrée de votre entreprise, cabinet ou boutique avec élégance. Confectionnées dans des matériaux durables et résistants aux intempéries (plexiglas, laiton, inox, aluminium Dibond) avec fixations par entretoises soignées.",
    image: "public/images/services/plaques/plaque-01.jpg",
    specs: {
      formats: "30 x 20 cm, 40 x 30 cm, 60 x 40 cm ou sur mesure",
      papier: "Plexiglas transparent, Laiton brossé, Inox brossé, Aluminium Dibond",
      finitions: "Gravure mécanique ou laser, Impression verso HD, Entretoises de fixation",
      delai: "Fabrication sur mesure"
    },
    badge: "Prestige Entrée",
    tags: ["Laiton & Plexi", "Fixations Inox", "Usage Intérieur/Extérieur"],
    whatsappMessage: "Bonjour, je souhaite commander une plaque professionnelle."
  },
  {
    id: "kakemono",
    title: "Kakemono / Roll-up",
    category: "signage",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Structures autoportantes rétractables avec toile infroissable et sac de transport pour événements et salons.",
    fullDesc: "Le support nomade par excellence pour vos salons, expositions, foires et réceptions. Facile à transporter et à monter en quelques secondes, notre roll-up intègre une bâche haute qualité qui ne gondole pas sur les bords.",
    image: "public/images/services/kakemono/kakemono-01.jpg",
    specs: {
      formats: "85 x 200 cm, 100 x 200 cm, 120 x 200 cm",
      papier: "Toile polyester anti-curling (ne s'enroule pas sur les côtés)",
      finitions: "Structure en aluminium robuste, Sac de transport inclus",
      delai: "Production rapide"
    },
    badge: "Événementiel & Salons",
    tags: ["Structure Alu", "Montage 30s", "Sac de transport"],
    whatsappMessage: "Bonjour, je souhaite commander un kakemono / roll-up."
  },
  {
    id: "signage",
    title: "Panneaux et Enseignes Publicitaires",
    category: "signage",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Enseignes de magasin, panneaux de façade et signalétique extérieure visibles de jour comme de nuit.",
    fullDesc: "Augmentez la visibilité de votre point de vente ou bâtiment d'entreprise avec nos enseignes et panneaux publicitaires. Lettres découpées, caissons lumineux ou panneaux en aluminium composite résistants à l'exposition extérieure.",
    image: "public/images/services/signage/signage-01.jpg",
    specs: {
      formats: "Dimensions entièrement sur-mesure selon la façade",
      papier: "Aluminium composite Dibond, Plexiglas diffusant, Bâche tendue",
      finitions: "Éclairage LED basse consommation, Lettres en relief 3D",
      delai: "Étude et réalisation sur mesure"
    },
    badge: "Visibilité Façade",
    tags: ["Panneau Dibond", "Enseigne Lumineuse", "Haute Résistance"],
    whatsappMessage: "Bonjour, je souhaite commander un panneau ou une enseigne publicitaire."
  },
  {
    id: "stickers",
    title: "Autocollants / Stickers",
    category: "packaging",
    categoryLabel: "Packaging & Goodies",
    shortDesc: "Stickers en vinyle découpés à la forme personnalisée, étanches et résistants pour emballages et marquage.",
    fullDesc: "Personnalisez vos colis, produits ou supports avec des autocollants vinyle sur mesure. Découpe exacte à la forme de votre logo, finition brillante ou mate, grande adhérence sur verre, carton, plastique et métal.",
    image: "public/images/services/stickers/sticker-01.jpg",
    specs: {
      formats: "Découpe libre à la forme (die-cut) ou planches prédécoupées",
      papier: "Vinyle adhésif haute résistance, Papier adhésif couché",
      finitions: "Pelliculage de protection, Finition mate ou brillante",
      delai: "Tirage express"
    },
    badge: "Personnalisation",
    tags: ["Découpe à la forme", "Vinyle Résistant", "Tous formats"],
    whatsappMessage: "Bonjour, je souhaite commander des autocollants / stickers."
  },
  {
    id: "packaging",
    title: "Packaging et Emballages Personnalisés",
    category: "packaging",
    categoryLabel: "Packaging & Goodies",
    shortDesc: "Boîtes personnalisées, coffrets produits et sacs boutique pour offrir une expérience client mémorable.",
    fullDesc: "Valorisez vos produits physiques dès le premier regard grâce à nos solutions de packaging sur-mesure. Boîtes rigides, étuis en cartonnette et sacs shopping conçus pour refléter le sérieux et le standing de votre marque.",
    image: "public/images/services/packaging/packaging-01.jpg",
    specs: {
      formats: "Gabarits personnalisés selon les dimensions exactes de vos produits",
      papier: "Carton compact rigide, Cartonnette micro-cannelée, Papier kraft",
      finitions: "Pelliculage, Dorure, Gaufrage, Poignées ruban ou torsadées",
      delai: "Étude de gabarit et production sur mesure"
    },
    badge: "Présentation Produit",
    tags: ["Boîtes sur mesure", "Sacs Boutique", "Expérience Client"],
    whatsappMessage: "Bonjour, je souhaite commander un packaging personnalisé."
  },
  {
    id: "brochures",
    title: "Brochures et Dépliants",
    category: "print",
    categoryLabel: "Impression Papier",
    shortDesc: "Dépliants 2 et 3 volets, brochures agrafées et livrets de présentation pour détailler votre offre commerciale.",
    fullDesc: "Présentez l'ensemble de vos activités, tarifs ou gammes de produits dans un document soigné et structuré. Du dépliant commercial pliable au livret agrafé multipages, nous assurons une mise en page claire et une impression nette.",
    image: "public/images/services/brochures/brochure-01.jpg",
    specs: {
      formats: "A4 fermé (A3 ouvert), A5 fermé, Format carré ou sur mesure",
      papier: "Couché 135g à 170g intérieur, Couverture renforcée jusqu'à 300g",
      finitions: "Pliage 2 volets (1 pli), 3 volets (accordéon ou roulé), Piqûre 2 points",
      delai: "Production soignée selon pagination"
    },
    badge: "Présentation Commerciale",
    tags: ["2 & 3 Volets", "Brochures Agrafées", "Mise en page pro"],
    whatsappMessage: "Bonjour, je souhaite commander une brochure ou un dépliant."
  },
  {
    id: "catalogues",
    title: "Catalogues",
    category: "print",
    categoryLabel: "Impression Papier",
    shortDesc: "Catalogues produits avec reliure dos carré collé ou spirale pour présenter l'ensemble de votre catalogue.",
    fullDesc: "L'outil de référence pour vos commerciaux, partenaires et clients. Confection de catalogues avec reliure robuste (dos carré collé ou reliure spirale métallique) et couverture pelliculée durable.",
    image: "public/images/services/catalogues/catalogue-01.jpg",
    specs: {
      formats: "A4 vertical, A4 à l'italienne (paysage), Format carré",
      papier: "Pages intérieures couché mat ou brillant, Couverture cartonnée 300g",
      finitions: "Dos carré collé, Vernis de protection, Pelliculage couverture",
      delai: "Délais adaptés au volume de pages"
    },
    badge: "Gros Volume",
    tags: ["Reliure Dos Carré", "Grand Nombre de Pages", "Usage Intensif"],
    whatsappMessage: "Bonjour, je souhaite commander un catalogue."
  },
  {
    id: "invitations",
    title: "Invitations et Cartes Événementielles",
    category: "print",
    categoryLabel: "Impression Papier",
    shortDesc: "Faire-part, cartons d'invitation et cartes d'accès pour événements d'entreprise, galas et cérémonies.",
    fullDesc: "Donnez le ton de votre événement dès l'envoi des invitations. Choix de papiers texturés d'exception, découpes personnalisées et finitions haut de gamme pour séduire vos invités.",
    image: "public/images/services/invitations/invitation-01.jpg",
    specs: {
      formats: "10 x 21 cm (format correspondance), 15 x 21 cm, Format carré ou double volet",
      papier: "Papiers de création texturés, Papier coton, Couché épais 350g",
      finitions: "Dorure, Gaufrage, Enveloppes coordonnées",
      delai: "Conception & tirage soignés"
    },
    badge: "Événements VIP",
    tags: ["Papier de Création", "Faire-part & Gala", "Enveloppes Coordonnées"],
    whatsappMessage: "Bonjour, je souhaite commander des invitations ou cartes événementielles."
  },
  {
    id: "labels",
    title: "Étiquettes Personnalisées",
    category: "packaging",
    categoryLabel: "Packaging & Goodies",
    shortDesc: "Étiquettes adhésives en rouleaux ou planches pour bouteilles, cosmétiques, emballages et pots.",
    fullDesc: "Habillez vos bouteilles, pots, flacons et emballages alimentaires ou cosmétiques avec des étiquettes adhésives conçues pour durer. Résistantes à l'humidité, aux manipulations et aux variations de température.",
    image: "public/images/services/labels/label-01.jpg",
    specs: {
      formats: "En rouleaux (bobines) pour pose manuelle ou machine, ou en planches",
      papier: "Papier couché adhésif, Polypropylène imperméable, Papier texturé",
      finitions: "Vernis brillant protecteur, Dorure métallique, Découpe sur mesure",
      delai: "Production en bobines ou planches"
    },
    badge: "Produits & Flacons",
    tags: ["En Rouleaux", "Résistant Humidité", "Pose Facile"],
    whatsappMessage: "Bonjour, je souhaite commander des étiquettes personnalisées."
  },
  {
    id: "t-shirts",
    title: "T-shirts et Vêtements Personnalisés",
    category: "textile",
    categoryLabel: "Textile & Vêtements",
    shortDesc: "Polos brodés, t-shirts sérigraphiés et vêtements d'entreprise pour renforcer l'esprit d'équipe et la visibilité.",
    fullDesc: "Fédérez votre équipe et affichez vos couleurs lors de vos activités avec du textile personnalisé de qualité. Marquage durable par broderie, sérigraphie ou flocage haute définition sur des tissus confortables.",
    image: "public/images/services/t-shirts/t-shirt-01.jpg",
    specs: {
      formats: "Tailles du S au 3XL (coupes homme, femme et unisexe)",
      papier: "Coton peigné, Maille piquée pour polos, Polyester respirant",
      finitions: "Broderie haute précision, Sérigraphie textile, Impression numérique textile",
      delai: "Production par séries"
    },
    badge: "Textile Pro",
    tags: ["Broderie & Sérigraphie", "Polos & T-shirts", "Tenues d'Entreprise"],
    whatsappMessage: "Bonjour, je souhaite commander des t-shirts ou vêtements personnalisés."
  },
  {
    id: "vehicle-branding",
    title: "Habillage Publicitaire de Véhicules",
    category: "signage",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Marquage adhésif, lettrage et covering sur utilitaires et voitures pour transformer votre flotte en publicité roulante.",
    fullDesc: "Multipliez vos contacts quotidiens grâce au marquage publicitaire de vos véhicules. Du simple lettrage d'identification (logo, coordonnées, activités) au covering partiel ou total avec film vinyle haute durabilité.",
    image: "public/images/services/vehicle-branding/vehicle-01.jpg",
    specs: {
      formats: "Conception sur le gabarit exact du modèle de votre véhicule",
      papier: "Vinyle adhésif coulé haute conformabilité pour carrosserie",
      finitions: "Pelliculage de protection anti-UV et rayures, Film micro-perforé pour vitres",
      delai: "Conception graphique et pose"
    },
    badge: "Publicité Roulante",
    tags: ["Lettrage & Covering", "Vinyle Longue Durée", "Flottes d'Entreprise"],
    whatsappMessage: "Bonjour, je souhaite commander un habillage publicitaire de véhicule."
  },
  {
    id: "logos",
    title: "Logos",
    category: "branding",
    categoryLabel: "Branding & Digital",
    shortDesc: "Création de logotypes professionnels, originaux et intemporels, adaptés à tous vos supports de communication.",
    fullDesc: "Donnez une identité forte et mémorable à votre marque avec un logo conçu sur-mesure. Nous étudions votre positionnement pour créer un symbole vectoriel unique, déclinable sur tous vos supports numériques et imprimés.",
    image: "public/images/services/logos/logo-01.jpg",
    specs: {
      formats: "Fichiers vectoriels exploitables à l'infini (AI, EPS, SVG, PDF) + PNG haute définition",
      papier: "Livrable numérique complet avec variantes couleur, blanc et noir",
      finitions: "Pistes de recherche créatives et ajustements",
      delai: "Processus créatif structuré"
    },
    badge: "Création Originale",
    tags: ["100% Vectoriel", "Tous Formats HD", "Identité Forte"],
    whatsappMessage: "Bonjour, je souhaite faire créer un logo professionnel."
  },
  {
    id: "branding",
    title: "Identité Visuelle / Branding",
    category: "branding",
    categoryLabel: "Branding & Digital",
    shortDesc: "Charte graphique complète, palette de couleurs, typographies et déclinaisons de marque harmonieuses.",
    fullDesc: "Une identité visuelle cohérente est la clé de la crédibilité de votre entreprise. Nous définissons l'ensemble de votre univers graphique : typographies, codes couleurs, règles d'usage et déclinaisons papeterie.",
    image: "public/images/services/branding/branding-01.jpg",
    specs: {
      formats: "Guide de marque / Charte graphique PDF + Dossier d'assets prêts à l'emploi",
      papier: "Mise en page des modèles de papeterie d'entreprise",
      finitions: "Déclinaisons pour le print et le digital",
      delai: "Accompagnement complet"
    },
    badge: "Stratégie de Marque",
    tags: ["Charte Graphique", "Cohérence Visuelle", "Guide de Marque"],
    whatsappMessage: "Bonjour, je souhaite concevoir une identité visuelle / branding complet."
  },
  {
    id: "corporate-stationery",
    title: "Supports de Communication pour Entreprises",
    category: "print",
    categoryLabel: "Impression Papier",
    shortDesc: "Pochettes à rabats, chemises porte-documents, blocs-notes et papeterie corporate pour vos rendez-vous d'affaires.",
    fullDesc: "Équipez vos collaborateurs avec des supports d'affaires qui renforcent votre image lors de chaque rendez-vous commercial. Chemises à rabats avec encoche pour carte de visite, en-têtes de lettre, blocs-notes et carnets personnalisés.",
    image: "public/images/services/corporate-stationery/stationery-01.jpg",
    specs: {
      formats: "Chemises à rabats A4 simple ou double rainage, Blocs A4/A5, Têtes de lettre A4",
      papier: "Carton couché 350g, Papier en-tête 90g compatible imprimantes de bureau",
      finitions: "Pelliculage extérieur, Fentes pour cartes de visite",
      delai: "Production soignée"
    },
    badge: "Outils Commerciaux",
    tags: ["Chemises à Rabats", "Blocs-notes", "Papeterie Complète"],
    whatsappMessage: "Bonjour, je souhaite commander des supports de communication pour mon entreprise."
  }
];

// Les 16 produits présentés dans le Showreel Vidéo
const SHOWREEL_PRODUCTS = [
  {
    order: 1,
    title: "Cartes de Visite",
    subtitle: "Papiers épais & finitions professionnelles",
    category: "CARTES DE VISITE",
    serviceId: "business-cards",
    image: "public/images/services/business-cards/business-card-01.jpg",
    badge: "Finition Soignée",
    features: ["Papiers épais 350g/400g", "Pelliculage mat & Soft Touch", "Découpe nette et précise"]
  },
  {
    order: 2,
    title: "Flyers",
    subtitle: "Campagnes et lancements promotionnels",
    category: "FLYERS",
    serviceId: "flyers",
    image: "public/images/services/flyers/flyer-01.jpg",
    badge: "Haute Définition",
    features: ["Formats A5 & A6", "Impression recto ou recto/verso", "Papier couché brillant ou mat"]
  },
  {
    order: 3,
    title: "Affiches Publicitaires",
    subtitle: "Affichage événementiel & urbain grand format",
    category: "AFFICHES PUBLICITAIRES",
    serviceId: "posters",
    image: "public/images/services/posters/poster-01.jpg",
    badge: "Grand Format",
    features: ["Formats A3, A2, A1, A0", "Encres résistantes", "Haute fidélité des couleurs"]
  },
  {
    order: 4,
    title: "Visuels Professionnels",
    subtitle: "Designs calibrés pour vos réseaux sociaux",
    category: "VISUELS PROFESSIONNELS",
    serviceId: "social-media",
    image: "public/images/services/social-media/social-media-01.jpg",
    badge: "Impact Digital",
    features: ["Publications & Carrousels", "Formats adaptés mobiles", "Identité graphique soignée"]
  },
  {
    order: 5,
    title: "Plaques Publicitaires & Pro",
    subtitle: "Plexiglas, laiton brossé et inox pour entrées",
    category: "PLAQUES PUBLICITAIRES",
    serviceId: "plaques",
    image: "public/images/services/plaques/plaque-01.jpg",
    badge: "Matériaux Durables",
    features: ["Plexiglas & Métaux brossés", "Gravure et impression soignées", "Entretoises de fixation inox"]
  },
  {
    order: 6,
    title: "Kakemonos / Roll-up",
    subtitle: "Structures nomades en aluminium pour salons",
    category: "KAKEMONO / ROLL-UP",
    serviceId: "kakemono",
    image: "public/images/services/kakemono/kakemono-01.jpg",
    badge: "Nomade & Efficace",
    features: ["Format standard 85x200cm", "Toile infroissable", "Montage facile en 30 secondes"]
  },
  {
    order: 7,
    title: "Panneaux & Enseignes",
    subtitle: "Signalétique extérieure et façades de magasins",
    category: "PANNEAUX & ENSEIGNES",
    serviceId: "signage",
    image: "public/images/services/signage/signage-01.jpg",
    badge: "Visibilité Extérieure",
    features: ["Aluminium composite résistant", "Lettres en relief & caissons", "Fabrication sur mesure"]
  },
  {
    order: 8,
    title: "Autocollants / Stickers",
    subtitle: "Vinyle adhésif haute résistance découpé à la forme",
    category: "AUTOCOLLANTS / STICKERS",
    serviceId: "stickers",
    image: "public/images/services/stickers/sticker-01.jpg",
    badge: "Découpe Sur-Mesure",
    features: ["Découpe exacte à la forme", "Adhésif résistant à l'eau", "Pour colis, emballages et vitres"]
  },
  {
    order: 9,
    title: "Packaging & Emballages",
    subtitle: "Boîtes personnalisées et sacs de boutique",
    category: "PACKAGING & EMBALLAGES",
    serviceId: "packaging",
    image: "public/images/services/packaging/packaging-01.jpg",
    badge: "Présentation Produit",
    features: ["Boîtes rigides & coffrets", "Sacs boutique personnalisés", "Mise en valeur de votre marque"]
  },
  {
    order: 10,
    title: "Brochures & Dépliants",
    subtitle: "Dépliants 2 et 3 volets & livrets de présentation",
    category: "BROCHURES & DÉPLIANTS",
    serviceId: "brochures",
    image: "public/images/services/brochures/brochure-01.jpg",
    badge: "Mise en Page Pro",
    features: ["Dépliants 2 et 3 volets", "Brochures agrafées", "Papier couché soigné"]
  },
  {
    order: 11,
    title: "Catalogues",
    subtitle: "Catalogues produits avec reliure soignée",
    category: "CATALOGUES",
    serviceId: "catalogues",
    image: "public/images/services/catalogues/catalogue-01.jpg",
    badge: "Présentation Complète",
    features: ["Reliure dos carré collé", "Pagination personnalisée", "Couverture protectrice"]
  },
  {
    order: 12,
    title: "Invitations & Cartes",
    subtitle: "Cartons d'invitation pour événements et cérémonies",
    category: "INVITATIONS",
    serviceId: "invitations",
    image: "public/images/services/invitations/invitation-01.jpg",
    badge: "Événements Soignés",
    features: ["Papiers texturés de qualité", "Finitions élégantes", "Formats personnalisés"]
  },
  {
    order: 13,
    title: "Étiquettes Personnalisées",
    subtitle: "Étiquettes adhésives pour flacons et bouteilles",
    category: "ÉTIQUETTES",
    serviceId: "labels",
    image: "public/images/services/labels/label-01.jpg",
    badge: "Usage Produit",
    features: ["En rouleaux ou planches", "Bonne tenue sur verre et plastique", "Découpe personnalisée"]
  },
  {
    order: 14,
    title: "Vêtements Personnalisés",
    subtitle: "Polos brodés et t-shirts pour vos équipes",
    category: "VÊTEMENTS PERSONNALISÉS",
    serviceId: "t-shirts",
    image: "public/images/services/t-shirts/t-shirt-01.jpg",
    badge: "Textile Équipe",
    features: ["Broderie & marquage durable", "Textiles de qualité", "Toutes tailles disponibles"]
  },
  {
    order: 15,
    title: "Habillage de Véhicules",
    subtitle: "Marquage publicitaire et lettrage sur véhicules",
    category: "HABILLAGE DE VÉHICULES",
    serviceId: "vehicle-branding",
    image: "public/images/services/vehicle-branding/vehicle-01.jpg",
    badge: "Publicité Roulante",
    features: ["Vinyle coulé carrosserie", "Lettrage & covering partiel", "Haute visibilité sur la route"]
  },
  {
    order: 16,
    title: "Logos & Identité Visuelle",
    subtitle: "Création de logos et chartes graphiques complètes",
    category: "LOGOS & IDENTITÉ VISUELLE",
    serviceId: "logos",
    image: "public/images/services/logos/logo-01.jpg",
    badge: "Création Vectorielle",
    features: ["Logos 100% vectoriels originaux", "Formats pour print & digital", "Charte graphique harmonieuse"]
  }
];

window.PIXORA_DATA = {
  config: PIXORA_CONFIG,
  services: SERVICES_DATA,
  showreel: SHOWREEL_PRODUCTS
};
