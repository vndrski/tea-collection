# 📱 Guide de Synchronisation - Sereni-Tea

## ☕ Problème : Mes données ne se synchronisent pas entre appareils

**Pourquoi ?** L'application utilise `localStorage` qui sauvegarde les données **uniquement dans le navigateur** où elles ont été créées.

---

## ✅ Solution : Export / Import

### 📤 **Sur votre ordinateur (où vous avez vos thés) :**

1. Ouvrez https://sereni-tea.netlify.app/
2. Cliquez sur le bouton **📤** (Export) en haut à droite
3. Un fichier `sereni-tea-backup-[date].json` sera téléchargé
4. Envoyez ce fichier sur votre iPhone :
   - Par AirDrop
   - Par email à vous-même
   - Via iCloud Drive / Google Drive
   - Via WhatsApp / Telegram

### 📥 **Sur votre iPhone :**

1. Ouvrez https://sereni-tea.netlify.app/
2. Cliquez sur le bouton **📥** (Import) en haut à droite
3. Sélectionnez le fichier `.json` que vous avez envoyé
4. Confirmez l'import
5. ✨ **Tous vos thés sont maintenant sur votre iPhone !**

---

## 🔄 **Synchronisation régulière**

À chaque fois que vous ajoutez des thés sur un appareil :

1. **Export** depuis l'appareil où vous avez ajouté des thés 📤
2. **Import** sur l'autre appareil 📥

---

## 💡 **Solutions alternatives (futures)**

### Option 1 : Compte en ligne (à venir)
- Synchronisation automatique entre appareils
- Sauvegarde cloud
- Nécessite un backend (Firebase, Supabase)

### Option 2 : Utiliser UN SEUL appareil
- Ajoutez tous vos thés directement depuis votre iPhone
- Plus besoin de synchroniser !

---

## 🎯 **Astuce rapide**

Si vous utilisez principalement votre iPhone :
1. Ouvrez Safari sur https://sereni-tea.netlify.app/
2. Appuyez sur **Partager** → **"Sur l'écran d'accueil"**
3. L'app est installée comme une vraie application
4. Ajoutez vos thés directement depuis votre téléphone

---

## ❓ Questions fréquentes

**Q : Puis-je fusionner les données de deux appareils ?**  
R : Actuellement non. L'import **remplace** toutes les données. Exportez toujours depuis l'appareil le plus à jour.

**Q : Mes données sont-elles sauvegardées quelque part ?**  
R : Oui, dans le `localStorage` de votre navigateur. Faites des exports réguliers pour plus de sécurité !

**Q : Que contient le fichier exporté ?**  
R : Tous vos thés (nom, marque, température, etc.) + vos boutiques personnalisées. Format JSON lisible.

---

**Besoin d'aide ?** Le fichier d'export est un simple fichier texte JSON. Vous pouvez l'ouvrir avec n'importe quel éditeur de texte pour voir vos données.
