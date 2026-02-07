# MezDepann - Épaviste Agréé Île-de-France

Site web haute conversion pour service d'épaviste agréé en Île-de-France, migré vers Astro.js avec optimisations de performance et SEO.

## 🚀 Déploiement

- **URL**: https://mezdepann.fr
- **Hébergement**: Vercel (Static Site Generation)
- **Performance**: Optimisé pour Lighthouse 95-100

## 📁 Structure

```
mezdepann/
├── astro.config.mjs      # Configuration Astro avec optimisations
├── package.json          # Dépendances pnpm
├── tsconfig.json         # Configuration TypeScript
├── tailwind.config.mjs   # Configuration Tailwind
├── vercel.json           # Configuration Vercel
├── public/
│   └── images/           # Images originales (backup)
├── src/
│   ├── assets/
│   │   └── images/       # Images optimisées par Astro
│   ├── components/
│   │   ├── astro/       # Composants Astro (statiques)
│   │   └── react/       # Composants React (hydratés)
│   ├── layouts/
│   │   └── Layout.astro # Layout de base
│   ├── pages/
│   │   ├── index.astro  # Page principale
│   │   └── api/
│   │       └── contact.ts # Endpoint API formulaire
│   ├── config/
│   │   ├── site.ts      # Configuration du site
│   │   └── schema.ts   # Données Schema.org
│   └── styles/
│       ├── global.css   # Styles globaux + Tailwind
│       └── hero.css     # Styles Hero personnalisés
```

## 🎨 Architecture

### Composants Astro (Statiques)
- `Hero.astro` - Section hero avec image optimisée
- `Services.astro` - Grille de services (6 cartes)
- `ValueSection.astro` - Proposition de valeur
- `Vehicles.astro` - Types de véhicules acceptés
- `Contact.astro` - Informations de contact
- `Footer.astro` - Pied de page

### Composants React (Hydratés)
- `Header.tsx` - `client:only="react"` - Header avec détection de scroll
- `ContactForm.tsx` - `client:visible` - Formulaire avec validation
- `CTAButtons.tsx` - `client:visible` - Boutons CTA lazy loaded

## ⚡ Optimisations Performance

### Build
- **Static Site Generation** (`output: 'static'`)
- **CSS inlining** (`inlineStylesheets: 'auto'`)
- **Code splitting** manuel pour React
- **Minification** (JS, CSS, HTML)
- **Image optimization** avec Sharp (WebP)

### Images
- Conversion automatique en WebP
- Tailles responsives
- Lazy loading (sauf hero)
- Hero image: `loading="eager"`, `fetchpriority="high"`

### JavaScript
- Chunks séparés:
  - `react-vendor` (~45KB gzipped)
  - `component-Header` (~0.8KB gzipped)
  - `component-ContactForm` (~1.9KB gzipped)
- Tree shaking activé
- Target: ES2020

### CSS
- Critical CSS inliné dans `<head>`
- Tailwind purgé et optimisé
- Variables CSS pour thème

### Resource Hints
- Preconnect vers domaines externes
- Preload fonts critiques
- Prefetch ressources probables

## 🔍 SEO

### Meta Tags
- Title, description, keywords
- Open Graph (Facebook)
- Twitter Card
- Canonical URL
- Langue/région (fr_FR)

### Schema.org
- Types: `LocalBusiness` + `AutomotiveBusiness`
- Services, horaires, ratings
- Zone d'intervention (Île-de-France)
- Données structurées JSON-LD

### HTML Sémantique
- Hiérarchie de titres (H1 → H2 → H3)
- Éléments sémantiques (`<main>`, `<section>`)
- ARIA labels où nécessaire

## 🛡️ Sécurité (Headers Vercel)

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## 📞 Contact

- **Téléphone** : 07 66 46 33 92
- **WhatsApp** : 07 66 46 33 92
- **Snapchat** : mez9.2
- **Email** : contact@mezdepann.fr

## 🛠️ Développement

### Installation
```bash
pnpm install
```

### Développement
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

### Preview
```bash
pnpm preview
```

## 📊 Métriques de Performance

### Lighthouse Targets
- **Performance**: 95-100
- **FCP**: < 1.8s
- **LCP**: < 2.5s
- **TBT**: < 200ms
- **CLS**: < 0.1

### Bundle Sizes
- React vendor: ~45KB (gzipped)
- Header component: ~0.8KB (gzipped)
- ContactForm: ~1.9KB (gzipped)
- Images: Optimisées en WebP (réduction moyenne 50-60%)

## 🎯 Fonctionnalités

### Formulaire de Contact
- Validation côté client
- Endpoint API `/api/contact`
- États de chargement
- Messages de succès/erreur
- TODO: Intégration service email (Resend/SendGrid)

### Responsive
- Mobile-first
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Boutons flottants mobile
- Header sticky avec scroll detection

## 📝 Notes

- Les images sont optimisées automatiquement lors du build
- Le formulaire nécessite une intégration email pour la production
- Les composants React sont lazy loaded pour optimiser le chargement initial
- Le site est entièrement statique (SSG) pour performance maximale
