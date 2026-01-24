# Application de Gestion des Dépenses Personnelles

Ceci est une application web fullstack pour gérer les dépenses personnelles, construite avec un backend Node.js (TypeScript), une base de données MySQL et un frontend React (TypeScript) avec Tailwind CSS.

## Fonctionnalités

### Backend
*   **Gestion des dépenses:** Ajouter, lister (par mois), obtenir le total par catégorie pour un mois.
*   **Gestion des catégories:** Ajouter, lister.
*   API RESTful propre avec validation des données (Zod) et gestion des erreurs.

### Frontend
*   Interface simple et interactive.
*   Page principale avec sélecteur de mois, liste des dépenses, et total du mois.
*   Formulaires modaux pour ajouter une dépense et une catégorie.
*   Utilisation de Tailwind CSS pour le style.
*   Connexion au backend via Axios et gestion du state avec React Query.

## Prérequis

Assurez-vous d'avoir installé les éléments suivants :

*   Node.js (version 18 ou supérieure recommandée)
*   npm (normalement inclus avec Node.js)
*   MySQL Server (version 8.0 ou supérieure recommandée)
*   Git

## Installation et Lancement

Suivez ces étapes pour installer et lancer l'application.

### 1. Cloner le dépôt

```bash
git clone <URL_DU_DEPOT>
cd gestion_depense_app
```

### 2. Configuration du Backend

1.  **Naviguer vers le dossier backend:**
    ```bash
    cd backend
    ```

2.  **Installer les dépendances:**
    ```bash
    npm install
    ```

3.  **Configurer la base de données:**
    *   Créez une base de données MySQL vide (par exemple, `gestion_depense`).
    *   Copiez le fichier `.env.example` vers `.env` et mettez à jour la variable `DATABASE_URL` avec vos informations de connexion MySQL.
        ```bash
        cp .env.example .env
        ```
        Exemple de `.env`:
        ```
        DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
        ```
        Remplacez `USER`, `PASSWORD`, `HOST`, `PORT` et `DATABASE_NAME` par vos identifiants MySQL.

4.  **Exécuter les migrations Prisma:**
    Ceci va créer les tables `Category` et `Expense` dans votre base de données.
    ```bash
    npx prisma migrate dev --name init
    ```
    Si vous êtes invité à saisir un nom, vous pouvez entrer "init".

5.  **Lancer le serveur backend en mode développement:**
    ```bash
    npm run dev
    ```
    Le serveur démarrera sur `http://localhost:3001` (ou le port spécifié dans votre `.env`).

### 3. Configuration du Frontend

1.  **Naviguer vers le dossier frontend (dans une nouvelle console/terminal):**
    ```bash
    cd ../frontend
    ```

2.  **Installer les dépendances:**
    ```bash
    npm install
    ```

3.  **Lancer l'application frontend en mode développement:**
    ```bash
    npm run dev
    ```
    L'application sera disponible sur `http://localhost:5173` (ou un autre port si 5173 est déjà utilisé).

    **Note:** Le frontend est configuré pour se connecter à `http://localhost:3001/api` par défaut. Si votre backend tourne sur un autre port/URL, mettez à jour la variable `VITE_API_BASE_URL` dans un fichier `.env` à la racine du dossier `frontend`.
    Exemple de `.env` dans `frontend/`:
    ```
    VITE_API_BASE_URL="http://localhost:PORT/api"
    ```

## Structure du Projet

```
/project-root
  /backend
    /src
      /config
      /controllers
      /routes
      /services
      /models
      /middlewares
      /utils
      app.ts
      server.ts
    prisma
    .env.example
    package.json
    tsconfig.json

  /frontend
    /src
      /components
      /pages
      /hooks
      /services (API calls)
      /types
      /styles
      App.tsx
      main.tsx
    tailwind.config.js
    postcss.config.js
    package.json
```

## Bonnes Pratiques Adoptées

*   **Code propre et commenté:** Suivi des conventions de code et ajout de commentaires explicatifs là où nécessaire.
*   **Typage strict TypeScript:** Utilisation intensive de TypeScript pour la robustesse et la maintenabilité.
*   **Variables d'environnement:** Gestion des configurations sensibles via des fichiers `.env`.
*   **Séparation des préoccupations (Backend):** Architecture en couches (controllers, services, modèles) pour une meilleure organisation et testabilité.
*   **Gestion du state (Frontend):** Utilisation de React Query pour la gestion efficace des données asynchrones et du cache.
*   **Composants réutilisables:** Conception de composants React modulaires.
*   **UI/UX:** Utilisation de Tailwind CSS pour un design flexible et moderne.

---