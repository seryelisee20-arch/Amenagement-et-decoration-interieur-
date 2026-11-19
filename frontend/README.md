# ORCA Déco CI – Front-End d'Intégration Mobile Money

Prototype et interface utilisateur conçus pour **ORCA Déco CI (Marcory, Abidjan)** dans le cadre du module **Atelier du logiciel** (Licence 3 Génie Logiciel, IIT 2026-2027).

- **Étudiant** : Christ-elisee Sery
- **Enseignant** : Sedrick Kouagni
- **Entreprise étudiée** : ORCA Déco CI (Marcory, Abidjan)
- **Opérateurs intégrés** : Wave, Orange Money, MTN MoMo, Moov Money

---

## 🌟 Présentation du Front-End

Ce front-end est une Single Page Application (SPA) moderne, réactive et autonome, modélisée selon les spécifications fonctionnelles (RF01 à RF07) et les diagrammes UML du projet :

1. **🛋️ Espace Client (Boutique en Ligne)** :
   - Catalogue haut de gamme de mobilier d'intérieur (Salons, Chambres, Salles à manger, Luminaires, Décoration).
   - Panier dynamique et gestion des quantités.
   - Tunnel de commande avec livraison & montage offerts à Abidjan (Marcory, Cocody, Zone 4, etc.).
   - Checkout Mobile Money multi-opérateurs avec **QR Code interactif Wave**, push USSD **Orange Money (#144#)**, **MTN MoMo (*133#)** et **Moov Money (*155#)**.
   - Reçu d'achat officiel avec référence unique (`PAY-CI-2026-XXXX`).

2. **🏪 Espace Vendeur (Point de Vente Magasin Marcory)** :
   - Terminal de caisse tactile conçu pour les équipes en magasin (Mr Kore).
   - Sélection rapide au comptoir, génération de la demande Mobile Money pour le client sur place.
   - **Règle métier capitale** : Le vendeur valide le statut dans le système ORCA, et non pas uniquement sur la capture d'écran du smartphone client.
   - Impression du ticket de caisse et bon de livraison / fiche de décharge client.

3. **📊 Espace Gestion & Rapprochement (Back-Office RF05 & RF07)** :
   - Tableau de bord en temps réel : Chiffre d'affaires encaissé, taux de succès, répartition par opérateur.
   - Journal exhaustif des transactions (filtres par statut, opérateur, canal et recherche textuelle).
   - **Outil de rapprochement unitaire** : Bouton pour interroger l'API prestataire et résoudre les transactions en attente.
   - Exportation des données au format CSV / Excel.

4. **🧪 Simulateur d'API & Validation L3 (Slide 12 du Cahier des Charges)** :
   - Permet aux membres du jury de tester en un clic les critères d'acceptation du cahier des charges :
     - **Scénario 1 : Succès nominal** -> Vente confirmée, stock décrémenté, reçu émis.
     - **Scénario 2 : Solde insuffisant (402)** -> Vente reste non payée, aucun article décompté.
     - **Scénario 3 : En attente / délai (202)** -> Statut conservé en attente pour rapprochement ultérieur.
     - **Scénario 4 : Doublon / Idempotence (409)** -> Interception des requêtes multiples pour éviter un double débit.
     - **Scénario 5 : Interruption réseau / Timeout (504)** -> Statut sécurisé, pas de fausse validation.
   - Console de logs en direct affichant les payloads JSON et codes HTTP.

---

## 🚀 Comment Lancer l'Application

### Méthode 1 : Avec le serveur local Python (Recommandé)
Ouvrez un terminal dans ce dossier et lancez :
```bash
python server.py
```
Puis ouvrez votre navigateur sur : [http://localhost:5173](http://localhost:5173)

### Méthode 2 : Avec Node.js
```bash
npm start
```

### Méthode 3 : Ouverture directe
Double-cliquez directement sur le fichier `index.html` dans l'explorateur de fichiers. L'application est 100% autonome et fonctionne sans connexion internet.

---

## 📐 Conformité avec les Exigences du Cahier des Charges

| Exigence | Intitulé | Implémentation dans le Front-End |
|---|---|---|
| **RF01** | Sélection de l'opérateur | Cartes interactives Wave, Orange Money, MTN MoMo, Moov Money avec logos officiels et délais estimés. |
| **RF02** | Initialisation de la demande | Création de la transaction liée à une vente unique (`VNT-2026-XXXX`) avec clé d'idempotence. |
| **RF03** | Gestion des statuts | Suivi des 4 statuts : `reussi`, `en_attente`, `echoue`, `annule`. |
| **RF04** | Confirmation fiable | La vente n'est marquée payée qu'après confirmation signée de l'API prestataire. |
| **RF05** | Consultation de l'historique | Journal complet avec recherche multi-critères et détails d'audit. |
| **RF06** | Gestion des erreurs | Messages explicites en cas de solde insuffisant ou rejet, sans blocage du client. |
| **RF07** | Rapprochement | Comparaison de la référence interne ORCA avec la référence externe de l'opérateur et réconciliation API. |

---

## 🔒 Principes de Sécurité Respectés
- **Zéro conservation de PIN** : Le code PIN ou mot de passe secret Mobile Money n'est jamais demandé ni stocké par l'application.
- **Idempotence** : Un même numéro de vente ne peut être débité deux fois.
- **Traçabilité** : Chaque étape génère un log horodaté consultable dans la console technique.
