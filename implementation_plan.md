# Plan de modification : PIXORA STUDIO (Accueil & Logo)

Ce document détaille les modifications à apporter à l'application existante pour répondre à vos nouvelles exigences de présentation.

## Proposed Changes

### 1. Gestion du Logo en GRAND (Fichier Local)
- **`index.html`** : Ajout d'une nouvelle section "Hero Logo" tout en haut avec le logo en grand format.
- Ajout d'un bouton « IMPORTER / MODIFIER MON LOGO » directement sur la page d'accueil (ou dans l'administration, selon votre préférence, mais la demande indique "sur la page d'accueil"). Pour garder l'aspect professionnel pour vos clients, je vous propose de cacher ce bouton pour les visiteurs normaux et de le mettre en évidence pour vous, ou simplement de le mettre dans l'administration. 
  - *Détail technique* : Utilisation de l'API `FileReader` en JavaScript pour vous permettre de sélectionner une image depuis votre ordinateur/téléphone (PNG, JPG, SVG) et de la sauvegarder dans le `localStorage` (convertie en Base64) pour qu'elle s'affiche partout instantanément.

### 2. Refonte de l'Accueil et Section "NOS SERVICES"
- **`index.html`** : 
  - Modification des textes d'accueil ("BIENVENUE CHEZ PIXORA STUDIO", "Des créations graphiques pensées...").
  - Création de la section "NOS SERVICES" juste en dessous de l'accueil.
  - La section affichera une grille de cartes (Carte de visite, Flyer, Affiche publicitaire...).
  - Chaque carte affichera le nom du service, le prix minimum ("À partir de 5 000 F CFA"), et une image représentative.
  - Les boutons "VOIR TOUTES MES CRÉATIONS" et "COMMANDER" seront placés de manière stratégique après les services.

### 3. Administration des images de services
- **`admin.html` et `js/admin.js`** : 
  - Ajout d'une nouvelle rubrique pour associer une image spécifique à chaque service affiché sur la page d'accueil.
  - Vous pourrez importer/choisir l'image de couverture pour "Carte de visite", "Flyer", etc.

### 4. Design et Typographie
- **`css/style.css`** :
  - Ajustement de l'ordre d'affichage et du design des nouvelles cartes de services pour respecter la charte Bleu + Blanc, minimaliste et très professionnelle.
  - Vérification stricte que la police `Inter` est appliquée partout de manière homogène.

## User Review Required

> [!WARNING]
> **Bouton d'importation du logo** : Vous avez demandé d'ajouter le bouton "IMPORTER / MODIFIER MON LOGO" sur la page d'accueil. Cependant, s'il est visible par tout le monde, un de vos clients pourrait cliquer dessus et changer votre logo sur son navigateur. 
> 
> **Solution proposée** : Je peux ajouter le bouton d'importation de fichier (PNG, JPG) **dans l'espace d'administration** (`admin.html`), et sur la page d'accueil, le logo s'affichera en très grand comme demandé. Êtes-vous d'accord pour que l'action d'importer le fichier se fasse depuis l'administration pour que le site public reste 100% professionnel pour le client final ?

## Verification Plan
1. **Upload de Fichier :** Importer un logo PNG depuis l'ordinateur et vérifier qu'il s'affiche en grand sur l'accueil et en petit dans la barre de navigation.
2. **Nos Services :** Vérifier que les cartes de services s'affichent correctement avec le prix "À partir de..." calculé depuis les tarifs `Basic`.
3. **Administration :** Vérifier qu'on peut changer l'image de couverture d'un service.
