# GAYDEL - Gestion & Vente de Café Premium

GAYDEL est une application web progressive (PWA) ultra moderne dédiée à la gestion et à la vente de café, construite avec Angular et Firebase.

## Fonctionnalités Clés

- **Tableau de Bord Premium**: Visualisation des KPIs et ventes en temps réel.
- **Géolocalisation Temps Réel**: Suivi des vendeurs de café sur une carte interactive.
- **QR Code Dynamique**: Chaque utilisateur possède un QR code unique pour les transactions sécurisées.
- **Gestion de Stock**: Système avancé pour les gestionnaires de stock avec alertes de seuil.
- **Pipeline Commercial**: Gestion des prospects pour les agents commerciaux.
- **Multi-rôles**: Accès basé sur les rôles (Super Admin, Gestionnaire, Agent, Vendeur).

## Stack Technique

- **Frontend**: Angular (Latest), Angular Material, RxJS, Chart.js, Leaflet.
- **Backend**: Firebase (Auth, Firestore, Storage, Hosting).
- **Design**: SCSS, Glassmorphism, Coffee-inspired palette.

## Installation

1. Clonez le dépôt.
2. Installez les dépendances :
   ```bash
   npm install --legacy-peer-deps
   ```
3. Configurez votre projet Firebase dans `src/environments/environment.ts`.
4. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```

## Déploiement

Pour déployer sur Firebase Hosting :

1. Installez Firebase CLI : `npm install -g firebase-tools`
2. Connectez-vous : `firebase login`
3. Initialisez Firebase : `firebase init`
4. Construisez le projet : `npm run build`
5. Déployez : `firebase deploy`

---
© 2024 GAYDEL Platform. Tous droits réservés.
