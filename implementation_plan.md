# PIXORA ACADEMY — Plan d'Implémentation

## Contexte

Création d'une application web vitrine/portfolio pour PIXORA ACADEMY, un studio de design graphique au Burkina Faso. L'application doit être professionnelle, moderne, élégante et entièrement fonctionnelle avec intégration WhatsApp.

---

## Stack Technique

- **Framework** : React 18 + TypeScript
- **Bundler** : Vite
- **Styling** : Tailwind CSS v3
- **Routing** : React Router DOM v6
- **Icons** : Lucide React
- **Animations** : Framer Motion (légères)
- **Images démo** : Générées avec l'outil generate_image

---

## Architecture du Projet

```
pixora-academy/
├── public/
│   ├── favicon.ico
│   └── logo-placeholder.png        ← emplacement pour votre logo
├── src/
│   ├── config/
│   │   └── app.config.ts           ← TOUTES les configurations modifiables
│   ├── data/
│   │   ├── services.data.ts        ← services + prix
│   │   └── portfolio.data.ts       ← créations (facilement modifiables)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── WhatsAppFloat.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── PortfolioCard.tsx
│   │   │   ├── PricingCard.tsx
│   │   │   └── Modal.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── PortfolioSection.tsx
│   │       ├── PricingSection.tsx
│   │       ├── AboutSection.tsx
│   │       └── ContactSection.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── CreationPage.tsx        ← page partageable /creation/:id
│   ├── hooks/
│   │   └── useWhatsApp.ts          ← logique WhatsApp centralisée
│   ├── utils/
│   │   └── whatsapp.utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html                      ← SEO + meta tags
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Fichiers Clés à Créer

### `src/config/app.config.ts` — Configuration Centralisée
Contiendra :
- `APP_NAME`, `SLOGAN`, `DESCRIPTION`
- `WHATSAPP_NUMBER` (format international Burkina Faso : +226XXXXXXXX)
- `PHONE`, `EMAIL`
- `SOCIAL_LINKS` (Facebook, Instagram, TikTok, WhatsApp)
- `PRIMARY_COLOR`, `SECONDARY_COLOR`
- `LOGO_PATH`

### `src/data/services.data.ts` — Services & Tarifs
Structure JSON facilement modifiable pour chaque service :
```typescript
{ id, name, description, price, currency: "FCFA", icon, features, category }
```

### `src/data/portfolio.data.ts` — Créations
Structure JSON pour chaque création :
```typescript
{ id, title, category, image, description, price, date, isDemo: true }
```

---

## Pages & Sections

### Page d'accueil (/)
1. **Header** sticky avec logo, navigation, bouton WhatsApp
2. **Hero** : titre + sous-titre + 2 boutons + composition visuelle
3. **Services** : grille de cartes avec icônes + prix + bouton Commander
4. **Portfolio** : galerie filtrée par catégorie
5. **Tarifs** : cartes de prix détaillées
6. **À propos** : présentation de PIXORA ACADEMY
7. **Contact** : formulaire → WhatsApp
8. **Footer** : liens + réseaux sociaux

### Page Création (/creation/:id)
- Vue détaillée d'une création
- Image grande qualité
- Informations complètes
- Bouton "Je veux ce type de design" → WhatsApp
- Bouton "Partager"
- Meta tags Open Graph dynamiques

---

## Intégration WhatsApp

### Messages automatiques
- **Service** : "Bonjour PIXORA ACADEMY 👋\nJe souhaite commander...\nService : {nom}\nPrix : {prix}\n..."
- **Création** : "Bonjour PIXORA ACADEMY 👋\nJ'ai vu votre création : {titre}\nJe souhaiterais..."
- **Contact** : "Bonjour PIXORA ACADEMY\nNom : {nom}\nTéléphone : {tel}\n..."
- **Général** : message par défaut

### Bouton flottant
- Visible en permanence en bas à droite
- Animation pulse légère
- Disparaît sur les petits écrans si trop gênant

---

## Design System

### Palette de couleurs (identité PIXORA)
- **Primaire** : Violet profond (#6C3DE0) → marque créativité + premium
- **Secondaire** : Or/Ambre (#F59E0B) → accent premium
- **Fond** : Noir profond (#0A0A0F) + Gris foncé (#111827)
- **Texte** : Blanc pur + Gris clair

### Typographie
- **Titres** : Playfair Display (élégance)
- **Corps** : Inter (lisibilité)
- **Accent** : Space Grotesk (modernité)

### Effets visuels
- Glassmorphism sur les cartes
- Gradients violet → pourpre
- Particules ou éléments décoratifs subtils
- Hover effects sur toutes les cartes
- Scroll animations légères

---

## Créations de Démonstration (10)

Toutes marquées `isDemo: true` et clairement identifiées comme exemples :
1. Logo "TechVision" (catégorie : Logo)
2. Flyer événement "Gala 2026" (catégorie : Flyer)
3. Affiche "Festival Musique" (catégorie : Affiche)
4. Étiquette "Miel Naturel" (catégorie : Étiquette)
5. Kakémono "Promo Soldes" (catégorie : Kakémono)
6. Packaging "Savon Artisanal" (catégorie : Packaging)
7. Carte de visite "Cabinet Médical" (catégorie : Carte de visite)
8. Publication Instagram "Resto" (catégorie : Réseaux sociaux)
9. Bannière web "E-commerce" (catégorie : Bannière)
10. Menu "Restaurant Étoile" (catégorie : Menu)

---

## SEO

```html
<title>PIXORA ACADEMY | Design graphique professionnel</title>
<meta name="description" content="PIXORA ACADEMY — Création graphique professionnelle : logos, affiches, flyers, étiquettes, kakémonos, packaging et bien plus.">
<meta property="og:title" content="PIXORA ACADEMY | Design graphique professionnel">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
```

---

## Plan d'Exécution

1. Initialiser le projet Vite + React + TypeScript + Tailwind
2. Créer `app.config.ts` et les fichiers de données
3. Générer les images de démonstration avec generate_image
4. Créer les composants UI de base
5. Créer les composants de sections
6. Assembler les pages
7. Configurer le routing (React Router)
8. Tester visuellement + corriger
9. Vérifier la checklist finale

---

## Vérification Finale (Checklist)

- [ ] Logo remplaçable facilement
- [ ] PIXORA ACADEMY visible correctement
- [ ] Page d'accueil fonctionnelle
- [ ] Menu fonctionnel + hamburger mobile
- [ ] Portfolio + filtres fonctionnels
- [ ] Ouverture création en détail
- [ ] Services visibles
- [ ] Prix visibles et modifiables
- [ ] Boutons Commander fonctionnels
- [ ] WhatsApp s'ouvre correctement
- [ ] Message WhatsApp prérempli
- [ ] Formulaire Contact → WhatsApp
- [ ] Bouton WhatsApp flottant
- [ ] Responsive mobile ✓
- [ ] Responsive ordinateur ✓
- [ ] Liens partageables (/creation/:id)
- [ ] SEO configuré
- [ ] Prêt pour déploiement
