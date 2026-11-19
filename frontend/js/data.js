/**
 * ORCA Déco CI - Référentiels et données initiales
 * Projet L3 Génie Logiciel - Atelier du logiciel
 * Entreprise étudiée : ORCA Déco CI (Marcory, Abidjan)
 */

export const OPERATEURS = [
  {
    id: 'wave',
    nom: 'Wave CI',
    badge: 'Wave',
    couleur: '#1dc3e8',
    couleurTexte: '#052b3b',
    couleurSecondaire: '#001833',
    prefixeDefaut: '07',
    modes: ['qr_code', 'push_notification'],
    codeUssd: 'N/A (App ou QR)',
    delaiEstime: '3 à 6 secondes',
    frais: '1%',
    tauxSuccesHistorique: '99.1%',
    description: 'Paiement sans frais supplémentaires par QR Code instantané ou notification push Wave.',
    instructions: 'Scannez le QR Code avec votre application Wave ou acceptez la notification sur votre mobile.'
  },
  {
    id: 'orange',
    nom: 'Orange Money CI',
    badge: 'Orange Money',
    couleur: '#ff7900',
    couleurTexte: '#ffffff',
    couleurSecondaire: '#000000',
    prefixeDefaut: '07',
    modes: ['push_notification', 'ussd'],
    codeUssd: '#144#37#',
    delaiEstime: '5 à 12 secondes',
    frais: '1%',
    tauxSuccesHistorique: '97.8%',
    description: 'Validation sécurisée via l’application Max it / Orange Money ou le menu USSD #144#.',
    instructions: 'Saisissez votre numéro Orange CI. Vous recevrez une invitation à composer votre code PIN.'
  },
  {
    id: 'mtn',
    nom: 'MTN Mobile Money',
    badge: 'MTN MoMo',
    couleur: '#ffcc00',
    couleurTexte: '#002244',
    couleurSecondaire: '#002244',
    prefixeDefaut: '05',
    modes: ['push_notification', 'qr_code'],
    codeUssd: '*133#',
    delaiEstime: '5 à 10 secondes',
    frais: '1%',
    tauxSuccesHistorique: '98.2%',
    description: 'Débit direct sur votre compte MTN MoMo après confirmation par code secret.',
    instructions: 'Une notification push est envoyée sur votre téléphone pour approuver le montant exact.'
  },
  {
    id: 'moov',
    nom: 'Moov Money CI',
    badge: 'Moov Money',
    couleur: '#005ca9',
    couleurTexte: '#ffffff',
    couleurSecondaire: '#78be20',
    prefixeDefaut: '01',
    modes: ['push_notification', 'ussd'],
    codeUssd: '*155#',
    delaiEstime: '6 à 14 secondes',
    frais: '1%',
    tauxSuccesHistorique: '96.5%',
    description: 'Règlement rapide par Moov Money Côte d’Ivoire (Menu *155# ou application Moov Money).',
    instructions: 'Un message Flash USSD s’affichera sur votre écran Moov pour renseigner votre code secret.'
  }
];

export const PRODUITS_INITIAUX = [
  {
    id: 'ORC-SAL-01',
    nom: 'Canapé d’Angle Assinie en Velours Bleu Nuit',
    categorie: 'Salons',
    prix: 485000,
    ancienPrix: 540000,
    badge: 'Best-seller',
    stock: 5,
    referenceInterne: 'REF-CAN-485',
    dimensions: '280 x 175 x 85 cm',
    matiere: 'Velours déperlant, piétement laiton',
    couleur: '#1e3a8a',
    description: 'Canapé panoramique modulable haut de gamme, assise ultra-confortable en mousse HR 35kg/m³.'
  },
  {
    id: 'ORC-TAB-02',
    nom: 'Table à Manger Bietry en Marbre & Chêne (8 pers.)',
    categorie: 'Salle à manger',
    prix: 395000,
    ancienPrix: null,
    badge: 'Nouveauté',
    stock: 4,
    referenceInterne: 'REF-TAB-395',
    dimensions: '220 x 100 x 76 cm',
    matiere: 'Marbre poli blanc carrare & chêne massif',
    couleur: '#e2e8f0',
    description: 'Plateau en marbre biseauté résistant aux taches avec piètement sculptural en chêne.'
  },
  {
    id: 'ORC-LIT-03',
    nom: 'Lit King Size Capitonné Marcory (180x200 cm)',
    categorie: 'Chambres',
    prix: 420000,
    ancienPrix: 470000,
    badge: 'Offre Duo',
    stock: 3,
    referenceInterne: 'REF-LIT-420',
    dimensions: '195 x 215 x 135 cm',
    matiere: 'Tissu texturé lin écru & bois renforcé',
    couleur: '#fef3c7',
    description: 'Lit double d’hôtel de luxe avec tête de lit haute capitonnée. Sommier double lattes inclus.'
  },
  {
    id: 'ORC-FAU-04',
    nom: 'Fauteuil Lounge Pivotant Cocody en Bouclette',
    categorie: 'Salons',
    prix: 165000,
    ancienPrix: null,
    badge: 'Coup de cœur',
    stock: 8,
    referenceInterne: 'REF-FAU-165',
    dimensions: '82 x 80 x 78 cm',
    matiere: 'Laine bouclée blanche, base acier doré',
    couleur: '#fafaf9',
    description: 'Fauteuil relaxant pivotant à 360°, design organique contemporain très chaleureux.'
  },
  {
    id: 'ORC-BUF-05',
    nom: 'Enfilade 4 Portes Banco en Cannage & Noyer',
    categorie: 'Salle à manger',
    prix: 280000,
    ancienPrix: 315000,
    badge: null,
    stock: 6,
    referenceInterne: 'REF-BUF-280',
    dimensions: '180 x 45 x 78 cm',
    matiere: 'Noyer teinté miel & cannage naturel tressé',
    couleur: '#78350f',
    description: 'Grand buffet de rangement élégant combinant bois noyer noble et artisanat de cannage.'
  },
  {
    id: 'ORC-LUM-06',
    nom: 'Lampadaire Sculptural Ébène & Laiton Lagune',
    categorie: 'Luminaires',
    prix: 78000,
    ancienPrix: 95000,
    badge: 'Promo',
    stock: 12,
    referenceInterne: 'REF-LUM-078',
    dimensions: 'H 185 cm, base Ø 35 cm',
    matiere: 'Base marbre noir, tige dorée brossée',
    couleur: '#ca8a04',
    description: 'Éclairage d’ambiance doux et chaleureux avec variateur d’intensité tactile intégré.'
  },
  {
    id: 'ORC-DEC-07',
    nom: 'Tapis Géométrique Laine Tissée Grand Format',
    categorie: 'Décoration',
    prix: 115000,
    ancienPrix: null,
    badge: null,
    stock: 10,
    referenceInterne: 'REF-TAP-115',
    dimensions: '200 x 290 cm',
    matiere: '100% laine filée main, dos antidérapant',
    couleur: '#e7e5e4',
    description: 'Tapis berbère moderne haut de gamme, motifs linéaires noirs sur fond beige naturel.'
  },
  {
    id: 'ORC-DEC-08',
    nom: 'Miroir Mural Arche Métal Doré Almadies',
    categorie: 'Décoration',
    prix: 85000,
    ancienPrix: 99000,
    badge: 'Tendance',
    stock: 7,
    referenceInterne: 'REF-MIR-085',
    dimensions: '180 x 80 x 4 cm',
    matiere: 'Verre biseauté HD & cadre aluminium doré',
    couleur: '#eab308',
    description: 'Miroir verrière arche à poser au sol ou à suspendre. Agrandit instantanément l’espace.'
  }
];

export const TRANSACTIONS_INITIALES = [
  {
    id: 'PAY-CI-2026-9042',
    refVente: 'VNT-2026-1042',
    canal: 'en_ligne',
    date: '2026-11-19T08:45:10Z',
    montant: 485000,
    client: {
      nom: 'Kouamé Jean-Marc',
      telephone: '+225 07 48 92 11',
      adresse: 'Cocody Danga, Villa 14, Abidjan'
    },
    operateur: 'wave',
    refExterne: 'WAV-CI-99482103',
    statut: 'reussi', // 'reussi', 'en_attente', 'echoue', 'annule'
    codeReponse: '200_SUCCESS',
    articles: [
      { id: 'ORC-SAL-01', nom: 'Canapé d’Angle Assinie en Velours Bleu Nuit', qte: 1, prix: 485000 }
    ],
    vendeur: 'Boutique Web ORCA Déco',
    logs: [
      { heure: '08:45:10', message: 'Vente VNT-2026-1042 créée (485 000 FCFA)' },
      { heure: '08:45:12', message: 'Session QR Wave Checkout émise' },
      { heure: '08:45:21', message: 'Webhook Wave: Paiement confirmé par l’utilisateur' },
      { heure: '08:45:22', message: 'Vente marquée PAYÉE dans le système ORCA Déco' }
    ]
  },
  {
    id: 'PAY-CI-2026-9041',
    refVente: 'VNT-2026-1041',
    canal: 'magasin',
    date: '2026-11-19T08:12:44Z',
    montant: 165000,
    client: {
      nom: 'Mme Bamba Fatou',
      telephone: '+225 07 09 33 22',
      adresse: 'Marcory Zone 4, Résidence Marina'
    },
    operateur: 'orange',
    refExterne: 'OM-CI-20261119-7419',
    statut: 'reussi',
    codeReponse: '200_SUCCESS',
    articles: [
      { id: 'ORC-FAU-04', nom: 'Fauteuil Lounge Pivotant Cocody en Bouclette', qte: 1, prix: 165000 }
    ],
    vendeur: 'Mr Kore (Caisse Magasin Marcory)',
    logs: [
      { heure: '08:12:44', message: 'Vente au comptoir initiée par le caissier' },
      { heure: '08:12:50', message: 'Notification Push Orange Money soumise au +225 07 09 33 22' },
      { heure: '08:13:03', message: 'Statut vérifié auprès de l’API Orange: SUCCÈS' },
      { heure: '08:13:04', message: 'Ticket de caisse #TC-1041 émis et stock décrémenté' }
    ]
  },
  {
    id: 'PAY-CI-2026-9040',
    refVente: 'VNT-2026-1040',
    canal: 'magasin',
    date: '2026-11-19T07:55:00Z',
    montant: 85000,
    client: {
      nom: 'Soro Bakary',
      telephone: '+225 05 55 12 89',
      adresse: 'Treichville Arras'
    },
    operateur: 'mtn',
    refExterne: 'MTN-TX-8827101',
    statut: 'echoue',
    codeReponse: '402_INSUFFICIENT_FUNDS',
    articles: [
      { id: 'ORC-DEC-08', nom: 'Miroir Mural Arche Métal Doré Almadies', qte: 1, prix: 85000 }
    ],
    vendeur: 'Mr Kore (Caisse Magasin Marcory)',
    logs: [
      { heure: '07:55:00', message: 'Vente au comptoir créée' },
      { heure: '07:55:05', message: 'Demande de débit direct MTN MoMo envoyée' },
      { heure: '07:55:18', message: 'Erreur retournée par MTN: Solde insuffisant' },
      { heure: '07:55:19', message: 'La vente reste NON PAYÉE conformément à la règle de gestion' }
    ]
  },
  {
    id: 'PAY-CI-2026-9039',
    refVente: 'VNT-2026-1039',
    canal: 'en_ligne',
    date: '2026-11-19T07:30:15Z',
    montant: 280000,
    client: {
      nom: 'Diallo Aïcha',
      telephone: '+225 01 22 88 44',
      adresse: 'Plateau Dokui, Rue des Jardins'
    },
    operateur: 'moov',
    refExterne: 'MOV-TX-3382910',
    statut: 'en_attente',
    codeReponse: '202_PENDING_CLIENT_ACTION',
    articles: [
      { id: 'ORC-BUF-05', nom: 'Enfilade 4 Portes Banco en Cannage & Noyer', qte: 1, prix: 280000 }
    ],
    vendeur: 'Boutique Web ORCA Déco',
    logs: [
      { heure: '07:30:15', message: 'Commande en ligne passée' },
      { heure: '07:30:20', message: 'Push Moov Money émis vers le numéro client' },
      { heure: '07:30:22', message: 'Statut conservé EN ATTENTE - Rapprochement ultérieur requis' }
    ]
  },
  {
    id: 'PAY-CI-2026-9038',
    refVente: 'VNT-2026-1038',
    canal: 'magasin',
    date: '2026-11-18T17:20:00Z',
    montant: 395000,
    client: {
      nom: 'Dr Konan Yao',
      telephone: '+225 07 11 44 99',
      adresse: 'Marcory Résidentiel'
    },
    operateur: 'wave',
    refExterne: 'WAV-CI-88190241',
    statut: 'reussi',
    codeReponse: '200_SUCCESS',
    articles: [
      { id: 'ORC-TAB-02', nom: 'Table à Manger Bietry en Marbre & Chêne', qte: 1, prix: 395000 }
    ],
    vendeur: 'Mr Kore (Caisse Magasin Marcory)',
    logs: [
      { heure: '17:20:00', message: 'Création vente magasin' },
      { heure: '17:20:08', message: 'Client a scanné le QR Code Wave au comptoir' },
      { heure: '17:20:15', message: 'Vérification du statut dans le système ORCA: Succès certifié' },
      { heure: '17:20:16', message: 'Bon de décharge et livraison programmée' }
    ]
  }
];
