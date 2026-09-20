/**
 * PIXORA ACADEMY — Base de données des Programmes de Formation
 */

window.PIXORA_DATA = {
  config: {
    whatsappNumber: "22603249548",
    whatsappDisplay: "+226 03 24 95 48",
    email: "contact@pixora-academy.com",
    address: "Ouagadougou, Burkina Faso"
  },

  programs: [
    {
      id: "logo-design",
      title: "Masterclass Design de Logo & Identité Visuelle",
      category: "branding",
      categoryLabel: "Branding",
      level: "Tous Niveaux",
      image: "assets/images/services/logos/logo-01.jpg",
      shortDesc: "Apprenez à concevoir des logos professionnels, mémorables et pertinents. De la recherche d'idées à la livraison des fichiers clients.",
      fullDesc: "Une formation complète pour maîtriser l'art de la création de logo. Vous apprendrez les principes fondamentaux du design de marque, la psychologie des couleurs, le choix typographique et la vectorisation parfaite sous Illustrator.",
      tags: ["Illustrator", "Branding", "Créativité"],
      specs: {
        formats: "Vectoriel (AI, EPS, SVG), Web (PNG, JPG)",
        papier: "N/A (Numérique)",
        finitions: "Création de Charte Graphique Simplifiée",
        delai: "4 Semaines"
      }
    },
    {
      id: "print-business",
      title: "Design de Cartes de Visite & Papeterie d'Entreprise",
      category: "print",
      categoryLabel: "Print",
      level: "Débutant",
      image: "assets/images/services/business-cards/business-card-01.jpg",
      shortDesc: "Maîtrisez les codes du design d'entreprise pour créer des cartes de visite, papiers à en-tête et enveloppes impactants.",
      fullDesc: "Cette formation vous apprend à concevoir des supports de papeterie d'entreprise qui reflètent le professionnalisme. Vous découvrirez les normes d'impression, les fonds perdus, les marges de sécurité et la préparation de fichiers pour l'imprimeur.",
      tags: ["InDesign", "Illustrator", "Prépresse"],
      specs: {
        formats: "8.5x5.5cm, A4, Enveloppes DL",
        papier: "Choix des papiers de création",
        finitions: "Préparation Vernis Sélectif, Dorure",
        delai: "2 Semaines"
      }
    },
    {
      id: "advertising-flyers",
      title: "Conception de Flyers, Affiches & Dépliants Publicitaires",
      category: "print",
      categoryLabel: "Print",
      level: "Intermédiaire",
      image: "assets/images/services/flyers/flyer-01.jpg",
      shortDesc: "Apprenez à structurer l'information visuelle pour créer des supports publicitaires captivants qui convertissent.",
      fullDesc: "Développez vos compétences en mise en page publicitaire. Ce cours aborde la hiérarchie visuelle, l'utilisation d'accroches, l'intégration d'images et la création de compositions équilibrées pour attirer l'œil.",
      tags: ["Photoshop", "InDesign", "Publicité"],
      specs: {
        formats: "A5, A4, A3, Dépliants 2/3 volets",
        papier: "Couché brillant/mat",
        finitions: "Pliages et découpes",
        delai: "3 Semaines"
      }
    },
    {
      id: "signage-pro",
      title: "Design de Plaques Professionnelles & Signalétique",
      category: "signage",
      categoryLabel: "Signalétique",
      level: "Avancé",
      image: "assets/images/services/plaques/plaque-01.jpg",
      shortDesc: "Devenez expert en signalétique intérieure et extérieure. Concevez des plaques pour médecins, avocats et entreprises.",
      fullDesc: "Apprenez les spécificités du design pour des supports rigides et durables. Vous comprendrez les contraintes de lisibilité à distance, le choix des matériaux virtuels et la préparation de fichiers pour la gravure ou l'impression UV.",
      tags: ["Illustrator", "Grand Format", "Signalétique"],
      specs: {
        formats: "Sur mesure (ex: 30x20cm, 60x40cm)",
        papier: "Plexiglas, Alu Dibond, Laiton (Théorie)",
        finitions: "Préparation pour entretoises",
        delai: "2 Semaines"
      }
    },
    {
      id: "large-format",
      title: "Maîtrise du Grand Format : Bâches, Roll-up & Kakemonos",
      category: "signage",
      categoryLabel: "Signalétique",
      level: "Intermédiaire",
      image: "assets/images/services/kakemono/kakemono-01.jpg",
      shortDesc: "Découvrez les techniques de conception pour des impressions gigantesques sans perte de qualité.",
      fullDesc: "Concevoir pour le grand format demande une gestion rigoureuse de la résolution et des proportions. Ce cours vous apprend à créer des visuels percutants pour des roll-ups, des bâches publicitaires et des stands d'exposition.",
      tags: ["Photoshop", "Illustrator", "Événementiel"],
      specs: {
        formats: "85x200cm, Bâches sur mesure",
        papier: "Bâche PVC, Tissu",
        finitions: "Préparation Oeillets, Fourreaux",
        delai: "3 Semaines"
      }
    },
    {
      id: "packaging-design",
      title: "Design de Packaging & Création d'Emballages",
      category: "packaging",
      categoryLabel: "Packaging",
      level: "Avancé",
      image: "assets/images/services/packaging/packaging-01.jpg",
      shortDesc: "Apprenez à habiller des produits avec des packagings créatifs, fonctionnels et attractifs.",
      fullDesc: "Une formation passionnante sur le design en volume. Vous apprendrez à créer des gabarits de découpe (die-lines), à positionner vos designs en 3D et à concevoir des étiquettes et des boîtes qui subliment les produits.",
      tags: ["Illustrator", "Photoshop", "Packaging"],
      specs: {
        formats: "Boîtes, Étiquettes, Sachets",
        papier: "Carton, Adhésif",
        finitions: "Préparation Découpe à la forme",
        delai: "4 Semaines"
      }
    },
    {
      id: "social-media-kit",
      title: "Création de Visuels pour les Réseaux Sociaux",
      category: "branding",
      categoryLabel: "Branding",
      level: "Tous Niveaux",
      image: "assets/images/services/social-media/social-media-01.jpg",
      shortDesc: "Concevez des bannières, des posts et des stories engageants pour Facebook, Instagram et LinkedIn.",
      fullDesc: "Maîtrisez les formats digitaux et les codes des réseaux sociaux. Vous apprendrez à décliner une identité visuelle sur différents formats web, à créer des templates réutilisables et à capter l'attention dans un fil d'actualité.",
      tags: ["Photoshop", "Web Design", "Social Media"],
      specs: {
        formats: "1080x1080, 1080x1920, Bannières",
        papier: "N/A (Digital)",
        finitions: "Optimisation Web (Export)",
        delai: "2 Semaines"
      }
    },
    {
      id: "vehicle-branding",
      title: "Habillage Publicitaire de Véhicules (Covering)",
      category: "signage",
      categoryLabel: "Signalétique",
      level: "Avancé",
      image: "assets/images/services/vehicle-branding/vehicle-01.jpg",
      shortDesc: "Apprenez les techniques complexes du design sur véhicule (voitures, utilitaires, camions).",
      fullDesc: "Le covering nécessite une vision en 3D et une grande précision technique. Découvrez comment utiliser les gabarits de véhicules, gérer les déformations de carrosserie et préparer des fichiers pour un covering total ou partiel.",
      tags: ["Illustrator", "Photoshop", "Covering"],
      specs: {
        formats: "Gabarits de véhicules à l'échelle 1:10 ou 1:20",
        papier: "Adhésif conformable (Théorie)",
        finitions: "Préparation pour impression et pose",
        delai: "3 Semaines"
      }
    }
  ]
};
