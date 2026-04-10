# Application SaaS de Suppression d'Arrière-Plan par l'IA

Une application SaaS full-stack prête pour la production, permettant la suppression automatique de l'arrière-plan des images grâce à l'Intelligence Artificielle. Construite avec une architecture moderne et performante.

##  Fonctionnalités

- **Traitement par IA Avancé :** Utilise la librairie `rembg` (et le modèle U²-Net) pour un détourage net des pixels sans aucune intervention manuelle.
- **Tableau de Bord SaaS Premium :** Interface utilisateur moderne avec un design haut de gamme (mode sombre appliqué par défaut), construite avec Shadcn UI et Tailwind CSS.
- **Comparateur Interactif :** Sliders de comparaison dynamique (Avant/Après) directement intégrés pour visualiser la qualité de la suppression d'arrière-plan.
- **Opérations Asynchrones :** Prêt à encaisser de lourdes charges grâce à l'intégration de "Celery" et "Redis", déportant les lourdes requêtes de l'Intelligence Artificielle de votre API principale.
- **Authentification JWT :** Sécurité de vos API grâce à la gestion complète des sessions par Token (accès et renouvellement automatiques).
- **Rapports Analytiques Riches :** Graphiques sophistiqués en courbe "Area" via `Recharts` avec des zones de dégradés interactives.

## 🛠 Stack Technique

**Frontend :**
- React 18 + Vite
- Tailwind CSS
- Shadcn UI (Inspirations minimalistes poussées : Vercel / Stripe)
- React Dropzone & React Compare Slider
- Recharts (Dashboard interactif avancé)
- Icônes par Lucide React
- Axios pour les appels réseau

**Backend :**
- Python 3.13
- Django 5 & Django REST Framework
- SimpleJWT (Authentification de type Token)
- Celery (Files d'attente / Tâches Asynchrones)
- Redis (Broker et Result Backend pour Celery)
- rembg (Traitement de l'image via de l'inférence locale au format ONNX)
- Pillow (Manipulation d'images bas-niveau)

##  Démarrage Rapide (Développement Local Windows/Mac/Linux)

### 1. Cloner le projet
```bash
git clone https://github.com/votre-nom-dutilisateur/supression_arrire_plan.git
cd supression_arrire_plan
```

### 2. Configuration du Serveur Backend (Intelligence Artificielle)
1. Allez dans le dossier du backend :
   ```bash
   cd backend
   ```
2. Créez un environnement virtuel Python (`venv`) et activez-le :
   ```bash
   python -m venv venv
   # Sur Windows (PowerShell) :
   .\venv\Scripts\Activate.ps1
   # Sur macOS/Linux :
   source venv/bin/activate
   ```
3. Installez toutes les dépendances requises :
   ```bash
   pip install -r requirements.txt
   ```
4. Lancez les migrations de base de données :
   ```bash
   python manage.py makemigrations users images
   python manage.py migrate
   ```
5. Allumez le Serveur de Développement :
   *(Note technique : Celery est configuré en mode 'Eager' asynchrone bypassé localement dans settings.py, simulant Redis pour ne rien avoir à configurer de complexe en local)*
   ```bash
   python manage.py runserver
   ```

### 3. Configuration du Site Web Frontend
1. Ouvrez un second terminal de commandes et naviguez dans le sous-dossier frontend :
   ```bash
   cd frontend
   ```
2. Téléchargez les packagings JavaScript et l'architecture UI :
   ```bash
   npm install
   ```
3. Lancez le serveur Vite :
   ```bash
   npm run dev
   ```

## 🐳 Déploiement en Production (Docker)
Si vous souhaitez héberger ou lancer le projet complet avec la connectique des bases de données de pointe et les workers d'arrière-plan, ce répertoire met à disposition tout le code d'infrastructures.
Il créera automatiquement les clusters PostgreSQL, la file réseau Redis et le serveur Django.
```bash
docker-compose up --build -d
```

## 🔒 Règles de Sécurité Incluses
- Validation stricte des images importées coté serveur (Prévention des malwares).
- Sécurité CORS et Protection CSRF appliqués depuis le framework Django.
- Limitation des requêtes paramétrée dans DRF (Rate Limiting).
- Authentification avec système de rafraichissement rotatif des Token JWT et "Black-List".

## 📄 Licence
Ce projet est distribué sous la Licence MIT. Parfait pour une utilisation ouverte ou de la revente orientée SaaS.
