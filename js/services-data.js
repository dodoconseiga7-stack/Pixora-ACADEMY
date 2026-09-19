/**
 * PIXORA STUDIO — Données complètes des 18 catégories de services et produits
 * Structure 100% cohérente avec les mockups et le showreel vidéo.
 */
const SERVICES_DATA = [
  {
    id: "cartes-de-visite",
    title: "Cartes de Visite de Prestige",
    category: "print-papier",
    categoryLabel: "Impression Papier",
    shortDesc: "Cartes d'affaires haut de gamme avec dorure à chaud dorée, vernis sélectif 3D et papier 450g.",
    fullDesc: "Créez une première impression inoubliable avec nos cartes de visite de prestige. Nous combinons des papiers d'exception (couché mat 400g, 450g texturé, kraft de luxe) avec des finitions artisanales : dorure à chaud (or, argent, cuivre), vernis sélectif 3D en relief, tranches colorées métallisées et pelliculage Soft Touch au toucher velours.",
    image: "public/images/services/cartes-de-visite/mockup.jpg",
    specs: {
      formats: "85 x 55 mm, 90 x 50 mm ou format sur-mesure",
      papier: "Couché mat 400g, Coton 450g, Texturé Rives",
      finitions: "Dorure à chaud, Vernis 3D sélectif, Tranche dorée, Soft Touch",
      delai: "3 à 5 jours ouvrés"
    },
    badge: "Best-seller Prestige",
    tags: ["Dorure à chaud", "Papier 450g", "Vernis 3D", "Soft Touch"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour la conception et l'impression de Cartes de Visite de Prestige."
  },
  {
    id: "flyers",
    title: "Flyers & Dépliants Promotionnels",
    category: "print-papier",
    categoryLabel: "Impression Papier",
    shortDesc: "Supports percutants pour vos événements, lancements et campagnes promotionnelles à fort impact.",
    fullDesc: "Diffusez votre message avec éclat grâce à nos flyers haute définition. Conçus pour capter le regard et inciter à l'action, nos flyers bénéficient d'une impression offset et numérique calibrée, sur papier couché brillant ou mat, avec options de vernis UV et pliages créatifs.",
    image: "public/images/services/flyers/mockup.jpg",
    specs: {
      formats: "A6 (105x148mm), A5 (148x210mm), DL (100x210mm)",
      papier: "135g économique, 170g standard, 250g premium, 350g cartonné",
      finitions: "Pelliculage mat/brillant, Vernis acrylique protecteur",
      delai: "24h à 72h"
    },
    badge: "Haute Conversion",
    tags: ["A5 & A6", "Impression HD", "Pelliculage", "Tirage Express"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour des Flyers promotionnels."
  },
  {
    id: "affiches",
    title: "Affiches Publicitaires Grand Format",
    category: "signaletique",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Affiches urbaines, événementielles et abribus avec encres pigmentaires résistantes aux UV.",
    fullDesc: "Donnez une visibilité maximale à vos campagnes avec nos affiches publicitaires grand format. Imprimées sur traceurs haute résolution avec encres écologiques résistantes aux intempéries et aux UV, idéales pour l'affichage urbain, abribus, vitrines et salons professionnels.",
    image: "public/images/services/affiches/mockup.jpg",
    specs: {
      formats: "A2, A1, A0, Abribus 120x176cm, 4x3m ou dimensions libres",
      papier: "Papier dos bleu 120g (affichage colle), Papier photo 200g satiné, Backlight rétro-éclairé",
      finitions: "Traitement anti-reflet, Résistance UV extérieure",
      delai: "48h"
    },
    badge: "Impact Urbain",
    tags: ["Grand Format", "Rétro-éclairé", "Encres UV", "Abribus"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite commander des Affiches publicitaires grand format."
  },
  {
    id: "visuels-reseaux",
    title: "Visuels & Campagnes Réseaux Sociaux",
    category: "branding",
    categoryLabel: "Branding & Digital",
    shortDesc: "Packs de publications, carrousels LinkedIn et visuels publicitaires à fort taux d'engagement.",
    fullDesc: "Propulsez votre présence sur les réseaux sociaux avec des créations graphiques modernes et calibrées pour les algorithmes (Instagram, LinkedIn, Facebook, TikTok). Nos designers conçoivent des templates réutilisables, des bannières de profil et des carrousels éducatifs qui convertissent votre audience en clients.",
    image: "public/images/services/visuels-reseaux/mockup.jpg",
    specs: {
      formats: "1080x1080 (carré), 1080x1350 (portrait 4:5), 1080x1920 (stories/reels)",
      papier: "Livrables digitaux HD (PNG, JPG, MP4 animé)",
      finitions: "Chartes Canva éditables ou fichiers sources Figma/Photoshop",
      delai: "48h à 5 jours selon formule"
    },
    badge: "Viral & Conversion",
    tags: ["Instagram", "Carrousels", "Bannières Ads", "Figma/PSD"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite booster ma présence en ligne avec des Visuels pour Réseaux Sociaux."
  },
  {
    id: "plaques-pro",
    title: "Plaques Professionnelles & Enseignes Murales",
    category: "signaletique",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Plaques de prestige en plexiglas transparent, laiton brossé et inox avec entretoises chromées.",
    fullDesc: "Affichez l'élégance et la crédibilité de votre établissement avec nos plaques professionnelles murales. Destinées aux cabinets médicaux, études d'avocats, sièges d'entreprise et commerces, nos plaques sont gravées ou imprimées au dos du plexiglas pour une brillance éternelle, fixées avec entretoises métalliques haut de gamme.",
    image: "public/images/services/plaques-pro/mockup.jpg",
    specs: {
      formats: "30x20cm, 40x30cm, 60x40cm ou sur mesure",
      papier: "Plexiglas coulé 5 à 10mm, Laiton brossé, Inox brossé, Dibond aluminium",
      finitions: "Gravure laser, Impression verso HD avec blanc de soutien, Bords polis",
      delai: "5 à 7 jours ouvrés"
    },
    badge: "Prestige Entreprise",
    tags: ["Laiton & Plexi", "Entretoises Inox", "Gravure Laser", "Garantie 10 ans"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite concevoir une Plaque Professionnelle pour mon entreprise."
  },
  {
    id: "kakemono-rollup",
    title: "Kakemonos & Roll-up Rétractables",
    category: "signaletique",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Structures autoportantes en aluminium anodisé avec toile anti-feu M1 et sac de transport.",
    fullDesc: "L'outil nomade incontournable pour vos salons professionnels, conférences, foires et accueils d'entreprise. Nos roll-up se montent en 30 secondes et utilisent une bâche Ferrari ou polyester anti-curling infroissable qui reste parfaitement tendue et ne gondole jamais.",
    image: "public/images/services/kakemono-rollup/mockup.jpg",
    specs: {
      formats: "85 x 200 cm, 100 x 200 cm, 120 x 200 cm, XXL 150 x 200 cm",
      papier: "Toile polyester 280g anti-incurvation sans PVC, Bâche M1 anti-feu",
      finitions: "Carter en aluminium renforcé, Pieds pivotants ou base lestée luxe, Sac rembourré",
      delai: "24h à 48h"
    },
    badge: "Incontournable Salons",
    tags: ["Alu Anodisé", "Anti-curling", "Montage 30s", "Sac inclus"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour un ou plusieurs Roll-up / Kakemonos."
  },
  {
    id: "panneaux-enseignes",
    title: "Panneaux & Enseignes Lumineuses LED",
    category: "signaletique",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Enseignes rétro-éclairées 3D, lettres découpées et panneaux Dibond grand format pour façades.",
    fullDesc: "Transformez votre devanture de magasin ou siège social en un point d'attraction lumineux. Nous fabriquons des enseignes lumineuses sur mesure : caissons rétro-éclairés LED basse consommation, lettres boîtiers 3D en aluminium ou plexiglas diffusant, et panneaux de façade en aluminium composite Dibond avec laquage haute résistance.",
    image: "public/images/services/panneaux-enseignes/mockup.jpg",
    specs: {
      formats: "Sur-mesure de 1 mètre à 20 mètres linéaires",
      papier: "Aluminium composite Dibond 3mm, Plexiglas PMMA coulé, Profilés thermolaqués",
      finitions: "Module LED étanche IP67, Rétro-éclairage halo ou face éclairante, Vernis anti-graffiti",
      delai: "10 à 15 jours ouvrés avec pose"
    },
    badge: "Impact Façade",
    tags: ["Lettres 3D", "LED Basse Conso", "Alu Dibond", "Visibilité Jour/Nuit"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour la conception d'une Enseigne Lumineuse / Panneau de façade."
  },
  {
    id: "stickers",
    title: "Autocollants & Stickers Vinyle Découpés",
    category: "packaging",
    categoryLabel: "Packaging & Goodies",
    shortDesc: "Stickers découpés à la forme (die-cut), holographiques, transparents et ultra-résistants.",
    fullDesc: "Marquez les esprits et habillez vos emballages avec nos stickers personnalisés en vinyle ultra-résistant. Découpe exacte suivant la forme de votre logo, finition brillante, mate ou holographique étincelante. Résistants à l'eau, aux UV et aux rayures.",
    image: "public/images/services/stickers/mockup.jpg",
    specs: {
      formats: "Découpe libre à la forme de 3x3cm à 30x30cm, en planches ou à l'unité",
      papier: "Vinyle adhésif haute adhérence 100 microns, Support kraft protecteur",
      finitions: "Pelliculage brillant anti-UV, Mat soyeux, Effet holographique arc-en-ciel",
      delai: "48h à 72h"
    },
    badge: "Branding Fun & Trendy",
    tags: ["Découpe Die-Cut", "Holographique", "Résistant Eau", "À l'unité ou planche"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite commander des Stickers / Autocollants personnalisés."
  },
  {
    id: "packaging",
    title: "Packaging & Emballages Personnalisés",
    category: "packaging",
    categoryLabel: "Packaging & Goodies",
    shortDesc: "Boîtes rigides aimantées de luxe, sacs shopping kraft et coffrets produits sur-mesure.",
    fullDesc: "Sublimez l'expérience de déballage (unboxing) de vos clients avec nos solutions d'emballage haut de gamme. Nous créons des boîtes cadeaux rigides à fermeture magnétique, des boîtes pliantes carton pour cosmétiques et e-commerce, ainsi que des sacs de boutique personnalisés avec poignées ruban et gaufrage.",
    image: "public/images/services/packaging/mockup.jpg",
    specs: {
      formats: "Boîtes sur-mesure adaptées exactement aux dimensions de vos produits",
      papier: "Carton compact 1200g rembordé, Carton micro-cannelé kraft, Papier couché 350g",
      finitions: "Fermeture aimantée, Calage mousse découpé, Dorure à chaud, Poignées gros-grain",
      delai: "10 à 20 jours selon complexité"
    },
    badge: "Luxe & Unboxing",
    tags: ["Boîtes Aimantées", "Sacs Boutique", "Dorure & Gaufrage", "Calage sur mesure"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour la conception et l'impression de Packaging personnalisé."
  },
  {
    id: "brochures-depliants",
    title: "Brochures Corporatives & Dépliants 3 Volets",
    category: "print-papier",
    categoryLabel: "Impression Papier",
    shortDesc: "Brochures piquées, dépliants 2 et 3 volets avec mise en page éditoriale soignée.",
    fullDesc: "Présentez l'étendue de vos services et vos valeurs d'entreprise avec des brochures institutionnelles au design irréprochable. Du dépliant 3 volets pliable en accordéon ou roulé jusqu'au livret agrafé 16 à 64 pages, nous garantissons un rendu d'impression irréprochable.",
    image: "public/images/services/brochures-depliants/mockup.jpg",
    specs: {
      formats: "A4 fermé (A3 ouvert), A5 fermé, Format carré 21x21cm",
      papier: "Intérieur couché 135g à 170g mat/brillant, Couverture 300g avec pelliculage",
      finitions: "Reliure 2 points métal (piquée), Plis accordéon ou roulé, Rainage net",
      delai: "3 à 5 jours ouvrés"
    },
    badge: "Édition Corporate",
    tags: ["2 & 3 Volets", "Piquée Agrafée", "Couverture 300g", "Mise en page pro"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour des Brochures d'entreprise ou Dépliants."
  },
  {
    id: "catalogues",
    title: "Catalogues Produits & Magazines de Marque",
    category: "print-papier",
    categoryLabel: "Impression Papier",
    shortDesc: "Catalogues reliure dos carré collé de 32 à 300 pages avec finitions de couverture prestige.",
    fullDesc: "L'outil ultime pour vos forces de vente et vos distributeurs. Nos catalogues produits bénéficient d'une reliure dos carré collé PUR ultra-robuste qui ne perd jamais de pages. La couverture peut être rehaussée d'un vernis sélectif ou d'une dorure pour affirmer votre statut de leader.",
    image: "public/images/services/catalogues/mockup.jpg",
    specs: {
      formats: "A4 portrait, A4 paysage, Grand carré 24x24cm",
      papier: "Intérieur couché mat 135g à 170g, Couverture cartonnée 350g",
      finitions: "Reliure dos carré collé PUR, Vernis sélectif 3D couverture, Pelliculage Soft Touch",
      delai: "7 à 10 jours ouvrés"
    },
    badge: "Volume & Prestige",
    tags: ["Dos Carré Collé", "Jusqu'à 300 pages", "Vernis 3D", "Catalogue Vente"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour l'édition et l'impression d'un Catalogue Produits."
  },
  {
    id: "invitations",
    title: "Invitations & Faire-Part Événementiels",
    category: "print-papier",
    categoryLabel: "Impression Papier",
    shortDesc: "Cartes d'invitation gala, mariages et lancements avec gaufrage, cachet de cire et papier coton.",
    fullDesc: "Annoncez vos événements d'exception (galas d'entreprise, séminaires VIP, mariages, inaugurations) avec des créations pleines d'émotion et de raffinement. Papier artisanal texturé, dorure à chaud, découpe laser dentelle et enveloppes doublées avec sceau en cire véritable.",
    image: "public/images/services/invitations/mockup.jpg",
    specs: {
      formats: "15x21cm, 10x21cm format billet, Carré 15x15cm, Cartons d'invitation doubles",
      papier: "Papier création Fedrigoni, Coton 500g, Papier texturé Vergé ou Rives",
      finitions: "Gaufrage en relief sans encre, Dorure or/rose gold, Enveloppes sur-mesure",
      delai: "4 à 6 jours ouvrés"
    },
    badge: "Luxe Événementiel",
    tags: ["Papier Coton", "Gaufrage Relief", "Dorure Or", "Cachet de Cire"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour des Invitations et Faire-part d'exception."
  },
  {
    id: "etiquettes",
    title: "Étiquettes Adhésives & Packaging en Rouleau",
    category: "packaging",
    categoryLabel: "Packaging & Goodies",
    shortDesc: "Étiquettes en rouleaux pour bouteilles de vin, spiritueux, cosmétiques et pots alimentaires.",
    fullDesc: "Habillez vos bouteilles, bocaux et flacons avec des étiquettes adhésives professionnelles livrées en rouleaux pour pose manuelle ou automatique sur chaîne de conditionnement. Résistance absolue à l'humidité, au gras et au froid (glacière / réfrigérateur).",
    image: "public/images/services/etiquettes/mockup.jpg",
    specs: {
      formats: "Toutes dimensions et formes géométriques ou libres en bobine",
      papier: "Papier texturé teinté dans la masse anti-humidité, Polypropylène (PP) étanche",
      finitions: "Dorure à chaud galbée, Vernis sérigraphique relief tactile, Colle renforcée",
      delai: "5 à 8 jours ouvrés"
    },
    badge: "Agroalimentaire & Cosmétique",
    tags: ["En Rouleaux", "Étanche & Frigo", "Dorure Galbée", "Pose Machine"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour des Étiquettes adhésives en rouleau."
  },
  {
    id: "vetements-personnalises",
    title: "Textile & Vêtements Corporate Personnalisés",
    category: "textile",
    categoryLabel: "Textile & Objets",
    shortDesc: "Polos brodés, t-shirts premium coton bio, casquettes et vestes corporate pour vos équipes.",
    fullDesc: "Unifiez l'image de vos collaborateurs avec des vêtements d'entreprise d'une qualité remarquable. Nous réalisons la broderie directe haute densité, la sérigraphie textile ou le flocage quadri haute définition sur des textiles durables et confortables.",
    image: "public/images/services/vetements-personnalises/mockup.jpg",
    specs: {
      formats: "Tailles du XS au 4XL, coupes homme, femme et unisexe",
      papier: "100% Coton biologique peigné 180g à 240g, Maille piquée 220g pour polos",
      finitions: "Broderie fil résistant aux lavages répétés, Sérigraphie douce, Impression DTF",
      delai: "5 à 10 jours ouvrés"
    },
    badge: "Image d'Équipe",
    tags: ["Broderie Haute Précision", "Coton Bio", "Polos & T-shirts", "Tenues Pro"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour des Vêtements personnalisés / Textile d'entreprise."
  },
  {
    id: "habillage-vehicules",
    title: "Habillage de Véhicules & Marquage Flottes",
    category: "signaletique",
    categoryLabel: "Signalétique & Grand Format",
    shortDesc: "Covering total ou partiel et lettrage adhésif sur utilitaires, berlines et camions.",
    fullDesc: "Transformez vos véhicules d'entreprise en puissants vecteurs publicitaires visibles 24h/24 dans toute la ville. Du simple lettrage d'identification (logo + coordonnées) jusqu'au semi-covering et total covering intégrale, nous utilisons des vinyles coulés thermoformables de marque 3M ou Avery.",
    image: "public/images/services/habillage-vehicules/mockup.jpg",
    specs: {
      formats: "Adapté au gabarit exact du véhicule (modèle et année 3D)",
      papier: "Vinyle coulé thermoformable 3M / Avery Dennison avec colle structurée sans bulles",
      finitions: "Pelliculage de protection anti-UV et anti-rayures, Film micro-perforé vitres",
      delai: "3 à 5 jours avec pose en atelier"
    },
    badge: "Publicité Roulante",
    tags: ["Covering 3M", "Total & Semi-Covering", "Micro-perforé", "Pose Pro Garantie"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour le Marquage / Habillage de véhicule publicitaire."
  },
  {
    id: "logos",
    title: "Création de Logos & Emblèmes de Marque",
    category: "branding",
    categoryLabel: "Branding & Digital",
    shortDesc: "Logotypes vectoriels originaux, minimalistes, intemporels et livrés avec tous les droits de propriété.",
    fullDesc: "La clé de voûte de votre identité visuelle. Nos directeurs artistiques conçoivent des logos sur-mesure après une étude approfondie de votre secteur d'activité, de vos concurrents et de votre cible. Livré sous tous formats vectoriels haute résolution (SVG, EPS, PDF, PNG) avec variantes de couleur pour fond clair et sombre.",
    image: "public/images/services/logos/mockup.jpg",
    specs: {
      formats: "Fichiers vectoriels infinis (AI, EPS, SVG, PDF) + Exports HD (PNG transparent, JPG)",
      papier: "Livrable numérique complet + Guide d'utilisation rapide",
      finitions: "3 concepts initiaux au choix, révisions illimitées, cession totale des droits",
      delai: "5 à 7 jours ouvrés"
    },
    badge: "Fondation de Marque",
    tags: ["100% Vectoriel", "3 Pistes Créatives", "Cession des Droits", "Formats HD"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite confier la Création du Logo de mon entreprise."
  },
  {
    id: "identite-visuelle",
    title: "Identité Visuelle & Charte Graphique Complète",
    category: "branding",
    categoryLabel: "Branding & Digital",
    shortDesc: "Brand book complet : typographies, palettes de couleurs, papeterie et règles d'utilisation.",
    fullDesc: "Offrez à votre entreprise une cohérence visuelle sans faille sur tous vos points de contact. Notre pack d'identité visuelle inclut le logo décliné, la sélection typographique, la palette chromatique (Pantone, CMJN, RVB, HEX), les règles d'interdiction et la papeterie complète (tête de lettre, cartes de correspondance, chemises).",
    image: "public/images/services/identite-visuelle/mockup.jpg",
    specs: {
      formats: "Brand Book PDF de 20 à 50 pages + Dossier complet d'assets prêts à l'emploi",
      papier: "Papeterie d'entreprise test imprimée incluse",
      finitions: "Déclinaisons digitales et print, templates de courriers Word/InDesign",
      delai: "10 à 15 jours ouvrés"
    },
    badge: "Stratégie Globale",
    tags: ["Brand Book PDF", "Palette Pantone", "Pack Papeterie", "Cohérence Totale"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite concevoir une Identité Visuelle complète / Charte graphique."
  },
  {
    id: "supports-entreprise",
    title: "Supports Corporate & Papeterie d'Affaires",
    category: "print-papier",
    categoryLabel: "Impression Papier",
    shortDesc: "Chemises à rabats, carnets de notes reliés cuir, blocs-notes et stylos corporate personnalisés.",
    fullDesc: "Donnez à vos rendez-vous clients et réunions d'affaires une allure de standing supérieur. Nos chemises à rabats porte-documents, sous-mains de bureau, carnets de notes à élastique et stylos en métal gravés véhiculent le professionnalisme de votre équipe au quotidien.",
    image: "public/images/services/supports-entreprise/mockup.jpg",
    specs: {
      formats: "Chemises A4 avec fentes pour carte de visite, Carnets A5 reliure cousue",
      papier: "Carton couché 350g, Couverture simili-cuir thermo-virant, Papier ivoire 90g",
      finitions: "Pelliculage mat Soft Touch, Marquage à chaud creux (debossing), Vernis sélectif",
      delai: "5 à 8 jours ouvrés"
    },
    badge: "Business Corporate",
    tags: ["Chemises à Rabats", "Carnets Personnalisés", "Marquage Creux", "Stylos Gravés"],
    whatsappMessage: "Bonjour Pixora Studio, je souhaite un devis pour des Supports d'entreprise et Papeterie corporate."
  }
];

// Liste des 16 produits phares pour le Showreel Vidéo (ordre strict de présentation)
const SHOWREEL_PRODUCTS = [
  {
    order: 1,
    title: "Cartes de Visite de Prestige",
    subtitle: "Dorure à chaud & Vernis 3D sélectif",
    category: "CARTES DE VISITE",
    serviceId: "cartes-de-visite",
    image: "public/images/services/cartes-de-visite/mockup.jpg",
    badge: "Finition Or 450g",
    features: ["Papier couché 450g", "Dorure à chaud", "Tranche métallisée"]
  },
  {
    order: 2,
    title: "Flyers Haute Définition",
    subtitle: "Campagnes promotionnelles percutantes",
    category: "FLYERS & DÉPLIANTS",
    serviceId: "flyers",
    image: "public/images/services/flyers/mockup.jpg",
    badge: "Tirage Express 24h",
    features: ["A5 & A6", "Pelliculage Soft Touch", "Qualité offset"]
  },
  {
    order: 3,
    title: "Affiches Publicitaires Grand Format",
    subtitle: "Affichage urbain & rétro-éclairé",
    category: "AFFICHES PUBLICITAIRES",
    serviceId: "affiches",
    image: "public/images/services/affiches/mockup.jpg",
    badge: "Visibilité Urbaine",
    features: ["Abribus & 4x3m", "Encres anti-UV", "Backlight diffusant"]
  },
  {
    order: 4,
    title: "Visuels pour Réseaux Sociaux",
    subtitle: "Carrousels & templates de conversion",
    category: "VISUELS DIGITAUX",
    serviceId: "visuels-reseaux",
    image: "public/images/services/visuels-reseaux/mockup.jpg",
    badge: "Taux de Clic Élevé",
    features: ["Instagram & LinkedIn", "Formats animés", "Fichiers sources"]
  },
  {
    order: 5,
    title: "Plaques Professionnelles Murales",
    subtitle: "Plexiglas transparent, laiton & inox brossé",
    category: "PLAQUES PUBLICITAIRES",
    serviceId: "plaques-pro",
    image: "public/images/services/plaques-pro/mockup.jpg",
    badge: "Entretoises Inox",
    features: ["Plexiglas 8mm", "Gravure laser", "Garantie 10 ans"]
  },
  {
    order: 6,
    title: "Kakemonos & Roll-up Rétractables",
    subtitle: "Structures nomades en aluminium anodisé",
    category: "KAKEMONO / ROLL-UP",
    serviceId: "kakemono-rollup",
    image: "public/images/services/kakemono-rollup/mockup.jpg",
    badge: "Montage en 30s",
    features: ["Toile anti-curling", "Sac de transport", "Norme anti-feu M1"]
  },
  {
    order: 7,
    title: "Panneaux & Enseignes Lumineuses LED",
    subtitle: "Lettres 3D & caissons lumineux pour façades",
    category: "PANNEAUX & ENSEIGNES",
    serviceId: "panneaux-enseignes",
    image: "public/images/services/panneaux-enseignes/mockup.jpg",
    badge: "Visibilité 24h/24",
    features: ["Aluminium Dibond", "LED basse consommation", "Étanche IP67"]
  },
  {
    order: 8,
    title: "Autocollants & Stickers Vinyle",
    subtitle: "Découpe à la forme & finitions holographiques",
    category: "AUTOCOLLANTS & STICKERS",
    serviceId: "stickers",
    image: "public/images/services/stickers/mockup.jpg",
    badge: "Découpe Die-Cut",
    features: ["Vinyle ultra-résistant", "Effet holographique", "100% étanche"]
  },
  {
    order: 9,
    title: "Packaging & Emballages de Luxe",
    subtitle: "Boîtes aimantées & sacs boutique personnalisés",
    category: "PACKAGING & EMBALLAGES",
    serviceId: "packaging",
    image: "public/images/services/packaging/mockup.jpg",
    badge: "Expérience Unboxing",
    features: ["Carton rigide 1200g", "Fermeture magnétique", "Calage sur mesure"]
  },
  {
    order: 10,
    title: "Brochures & Dépliants 3 Volets",
    subtitle: "Présentations institutionnelles & catalogues",
    category: "BROCHURES & DÉPLIANTS",
    serviceId: "brochures-depliants",
    image: "public/images/services/brochures-depliants/mockup.jpg",
    badge: "Mise en page pro",
    features: ["2 & 3 volets", "Pli accordéon", "Couverture 300g"]
  },
  {
    order: 11,
    title: "Catalogues Produits & Magalogs",
    subtitle: "Reliure dos carré collé PUR ultra-résistante",
    category: "CATALOGUES",
    serviceId: "catalogues",
    image: "public/images/services/catalogues/mockup.jpg",
    badge: "Jusqu'à 300 pages",
    features: ["Dos carré collé", "Vernis sélectif", "Papiers d'art"]
  },
  {
    order: 12,
    title: "Invitations & Faire-Part de Prestige",
    subtitle: "Gaufrage relief, dorure & papier coton",
    category: "INVITATIONS",
    serviceId: "invitations",
    image: "public/images/services/invitations/mockup.jpg",
    badge: "Finition Cire & Or",
    features: ["Papier coton 500g", "Gaufrage à sec", "Enveloppes doublées"]
  },
  {
    order: 13,
    title: "Étiquettes Adhésives Personnalisées",
    subtitle: "Rouleaux pour bouteilles, flacons & cosmétiques",
    category: "ÉTIQUETTES",
    serviceId: "etiquettes",
    image: "public/images/services/etiquettes/mockup.jpg",
    badge: "Résistant Froid & Eau",
    features: ["En bobines", "Vernis protecteur", "Colle renforcée"]
  },
  {
    order: 14,
    title: "Vêtements & Textiles d'Entreprise",
    subtitle: "Polos brodés, t-shirts premium & casquettes",
    category: "TEXTILE PERSONNALISÉ",
    serviceId: "vetements-personnalises",
    image: "public/images/services/vetements-personnalises/mockup.jpg",
    badge: "Broderie Haute Définition",
    features: ["Coton bio peigné", "Broderie durable", "Tailles XS au 4XL"]
  },
  {
    order: 15,
    title: "Habillage Publicitaire de Véhicules",
    subtitle: "Total covering & marquage de flottes utilitaires",
    category: "HABILLAGE VÉHICULES",
    serviceId: "habillage-vehicules",
    image: "public/images/services/habillage-vehicules/mockup.jpg",
    badge: "Vinyle 3M Garanti",
    features: ["Covering intégral", "Micro-perforé vitres", "Pose atelier certifiée"]
  },
  {
    order: 16,
    title: "Logos & Identités Visuelles Complètes",
    subtitle: "Création originale, chartes graphiques & brand books",
    category: "LOGOS & IDENTITÉ VISUELLE",
    serviceId: "logos",
    image: "public/images/services/logos/mockup.jpg",
    badge: "100% Vectoriel",
    features: ["Fichiers sources AI/EPS", "Guide de marque", "Cession totale"]
  }
];

window.PIXORA_DATA = {
  services: SERVICES_DATA,
  showreel: SHOWREEL_PRODUCTS,
  whatsappNumber: "22600000000", // Remplaçable facilement par le numéro WhatsApp officiel
  studioName: "PIXORA STUDIO",
  tagline: "Communication Visuelle, Branding & Impression Haute Définition"
};
