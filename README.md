# ☕ Sereni-Tea

Une application web moderne pour gérer votre collection de thés personnelle.

## 🚀 Déploiement sur iPhone

### Option 1 : Netlify (Recommandé)
1. Créez un compte gratuit sur [netlify.com](https://www.netlify.com/)
2. Glissez-déposez le dossier `tea-collection` sur Netlify
3. Obtenez votre URL : `votre-app.netlify.app`
4. Sur iPhone, ouvrez l'URL dans Safari
5. Appuyez sur **Partager** → **Sur l'écran d'accueil**
6. L'app est maintenant installée comme une vraie application ! 🎉

### Option 2 : GitHub Pages
1. Créez un repository GitHub public
2. Uploadez tous les fichiers
3. Activez GitHub Pages dans Settings
4. Accédez à l'URL générée

### Option 3 : Serveur Local
```bash
cd tea-collection
python3 -m http.server 8000
# Puis sur iPhone : http://[IP-de-votre-ordinateur]:8000
```

## ✨ Fonctionnalités

- 📝 Ajouter et gérer vos thés
- 🔍 Recherche et filtres avancés
- 🗺️ Carte interactive des origines
- ⏱️ Timer d'infusion circulaire
- 🏪 Gestion des boutiques de thé
- 🌐 Scraping automatique d'informations
- 💾 Sauvegarde locale (localStorage)
- 📱 PWA : fonctionne hors ligne
- 📤📥 Export/Import pour synchroniser entre appareils

## 🎨 Design

- Fond blanc épuré
- Accent vert fluo (#a6ff47)
- Design flat et minimaliste
- Totalement responsive (mobile & desktop)

## 🔄 Synchronisation entre appareils

Vos données sont stockées localement dans votre navigateur. Pour synchroniser entre appareils :

1. **Sur l'appareil source** : Cliquez sur 📤 (Export) en haut à droite
2. **Transférez le fichier** `.json` vers votre autre appareil (AirDrop, email, cloud...)
3. **Sur l'appareil cible** : Cliquez sur 📥 (Import) et sélectionnez le fichier

📖 **Guide détaillé** : Consultez [GUIDE_SYNCHRONISATION.md](./GUIDE_SYNCHRONISATION.md)

---

**Made with ☕ and 💚**
