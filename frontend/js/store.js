/**
 * ORCA Déco CI - Gestionnaire d'État (Store) & Règles Métier
 * Projet L3 Génie Logiciel - Atelier du logiciel
 */

import { PRODUITS_INITIAUX, TRANSACTIONS_INITIALES, OPERATEURS } from './data.js';

const STORAGE_KEY_PRODUITS = 'orca_deco_produits_v1';
const STORAGE_KEY_TRANSACTIONS = 'orca_deco_transactions_v1';
const STORAGE_KEY_PANIER = 'orca_deco_panier_v1';

class Store {
  constructor() {
    this.produits = this.chargerProduits();
    this.transactions = this.chargerTransactions();
    this.panier = this.chargerPanier();
    this.panierMagasin = [];
    this.operateurs = OPERATEURS;
    this.vueActive = 'boutique'; // 'boutique', 'caisse', 'admin', 'simulateur'
    this.auditeurs = [];
  }

  // Abonnements pour réactivité
  abonner(fn) {
    this.auditeurs.push(fn);
    return () => {
      this.auditeurs = this.auditeurs.filter(cb => cb !== fn);
    };
  }

  notifier(evenement, donnees) {
    this.auditeurs.forEach(fn => fn(evenement, donnees));
  }

  // --- PRODUITS ---
  chargerProduits() {
    try {
      const stocke = localStorage.getItem(STORAGE_KEY_PRODUITS);
      if (stocke) return JSON.parse(stocke);
    } catch (e) {
      console.warn('Erreur de lecture du localStorage pour les produits:', e);
    }
    return [...PRODUITS_INITIAUX];
  }

  sauvegarderProduits() {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUITS, JSON.stringify(this.produits));
    } catch (e) {
      console.error(e);
    }
  }

  getProduit(id) {
    return this.produits.find(p => p.id === id);
  }

  // --- PANIER BOUTIQUE (EN LIGNE) ---
  chargerPanier() {
    try {
      const stocke = localStorage.getItem(STORAGE_KEY_PANIER);
      if (stocke) return JSON.parse(stocke);
    } catch (e) {
      console.warn(e);
    }
    return [
      { produitId: 'ORC-SAL-01', qte: 1 } // Article pré-rempli pour faciliter le test
    ];
  }

  sauvegarderPanier() {
    try {
      localStorage.setItem(STORAGE_KEY_PANIER, JSON.stringify(this.panier));
    } catch (e) {
      console.error(e);
    }
  }

  ajouterAuPanier(produitId, qte = 1) {
    const p = this.getProduit(produitId);
    if (!p) return;
    const existant = this.panier.find(item => item.produitId === produitId);
    if (existant) {
      existant.qte += qte;
    } else {
      this.panier.push({ produitId, qte });
    }
    this.sauvegarderPanier();
    this.notifier('panier_modifie', this.panier);
  }

  modifierQtePanier(produitId, delta) {
    const existant = this.panier.find(item => item.produitId === produitId);
    if (!existant) return;
    existant.qte += delta;
    if (existant.qte <= 0) {
      this.panier = this.panier.filter(item => item.produitId !== produitId);
    }
    this.sauvegarderPanier();
    this.notifier('panier_modifie', this.panier);
  }

  retirerDuPanier(produitId) {
    this.panier = this.panier.filter(item => item.produitId !== produitId);
    this.sauvegarderPanier();
    this.notifier('panier_modifie', this.panier);
  }

  viderPanier() {
    this.panier = [];
    this.sauvegarderPanier();
    this.notifier('panier_modifie', this.panier);
  }

  getDetailsPanier() {
    return this.panier.map(item => {
      const p = this.getProduit(item.produitId);
      return {
        ...item,
        produit: p,
        sousTotal: p ? p.prix * item.qte : 0
      };
    }).filter(i => i.produit != null);
  }

  getTotalPanier() {
    return this.getDetailsPanier().reduce((acc, curr) => acc + curr.sousTotal, 0);
  }

  // --- CAISSE MAGASIN (VENTE AU COMPTOIR) ---
  ajouterArticleMagasin(produitId, qte = 1) {
    const p = this.getProduit(produitId);
    if (!p) return;
    const existant = this.panierMagasin.find(item => item.produitId === produitId);
    if (existant) {
      existant.qte += qte;
    } else {
      this.panierMagasin.push({ produitId, qte });
    }
    this.notifier('caisse_modifiee', this.panierMagasin);
  }

  modifierQteMagasin(produitId, delta) {
    const existant = this.panierMagasin.find(item => item.produitId === produitId);
    if (!existant) return;
    existant.qte += delta;
    if (existant.qte <= 0) {
      this.panierMagasin = this.panierMagasin.filter(item => item.produitId !== produitId);
    }
    this.notifier('caisse_modifiee', this.panierMagasin);
  }

  viderPanierMagasin() {
    this.panierMagasin = [];
    this.notifier('caisse_modifiee', this.panierMagasin);
  }

  getDetailsPanierMagasin() {
    return this.panierMagasin.map(item => {
      const p = this.getProduit(item.produitId);
      return {
        ...item,
        produit: p,
        sousTotal: p ? p.prix * item.qte : 0
      };
    }).filter(i => i.produit != null);
  }

  getTotalPanierMagasin() {
    return this.getDetailsPanierMagasin().reduce((acc, curr) => acc + curr.sousTotal, 0);
  }

  // --- TRANSACTIONS & HISTORIQUE (RF01 - RF07) ---
  chargerTransactions() {
    try {
      const stocke = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (stocke) return JSON.parse(stocke);
    } catch (e) {
      console.warn('Erreur localStorage transactions:', e);
    }
    return [...TRANSACTIONS_INITIALES];
  }

  sauvegarderTransactions() {
    try {
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(this.transactions));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Règle de gestion RF02 & Non-fonctionnelle :
   * Idempotence & Unicité : Détection des doubles requêtes pour éviter un double débit.
   */
  detecterDoublon(refVente, montant, operateur) {
    const transactionExistante = this.transactions.find(t => 
      t.refVente === refVente &&
      t.montant === montant &&
      t.statut === 'reussi'
    );
    return transactionExistante || null;
  }

  creerTransaction({ canal, montant, client, operateur, articles, vendeur }) {
    const timestamp = Date.now();
    const refVente = `VNT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `PAY-CI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const prefixeOperateur = {
      wave: 'WAV-CI',
      orange: 'OM-CI',
      mtn: 'MTN-TX',
      moov: 'MOV-TX'
    }[operateur] || 'MOMO-CI';

    const refExterne = `${prefixeOperateur}-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const nouvelleTransaction = {
      id,
      refVente,
      canal, // 'en_ligne' ou 'magasin'
      date: new Date().toISOString(),
      montant,
      client: {
        nom: client.nom || 'Client Anonyme ORCA',
        telephone: client.telephone || '+225 07 00 00 00',
        adresse: client.adresse || 'Marcory, Abidjan'
      },
      operateur,
      refExterne,
      statut: 'en_attente', // Statut initial RF03
      codeReponse: '202_PENDING',
      articles: articles || [],
      vendeur: vendeur || (canal === 'magasin' ? 'Mr Kore (Caisse Marcory)' : 'Boutique Web ORCA Déco'),
      logs: [
        {
          heure: new Date().toLocaleTimeString('fr-FR'),
          message: `Demande de paiement émise (${montant.toLocaleString('fr-FR')} FCFA via ${operateur.toUpperCase()})`
        }
      ]
    };

    // Insérer en tête
    this.transactions.unshift(nouvelleTransaction);
    this.sauvegarderTransactions();
    this.notifier('transaction_creee', nouvelleTransaction);
    return nouvelleTransaction;
  }

  mettreAJourStatutTransaction(transactionId, nouveauStatut, codeReponse, messageLog) {
    const t = this.transactions.find(item => item.id === transactionId);
    if (!t) return null;

    t.statut = nouveauStatut;
    if (codeReponse) t.codeReponse = codeReponse;
    t.logs.push({
      heure: new Date().toLocaleTimeString('fr-FR'),
      message: messageLog || `Statut mis à jour: ${nouveauStatut.toUpperCase()}`
    });

    // Si le paiement est réussi, on décrémente les stocks
    if (nouveauStatut === 'reussi') {
      t.articles.forEach(art => {
        const prod = this.getProduit(art.id);
        if (prod && prod.stock > 0) {
          prod.stock = Math.max(0, prod.stock - (art.qte || 1));
        }
      });
      this.sauvegarderProduits();
    }

    this.sauvegarderTransactions();
    this.notifier('transaction_maj', t);
    return t;
  }

  // Réinitialisation pour les tests de soutenance
  reinitialiserDonnees() {
    this.produits = [...PRODUITS_INITIAUX];
    this.transactions = [...TRANSACTIONS_INITIALES];
    this.panier = [{ produitId: 'ORC-SAL-01', qte: 1 }];
    this.panierMagasin = [];
    this.sauvegarderProduits();
    this.sauvegarderTransactions();
    this.sauvegarderPanier();
    this.notifier('donnees_reinitialisees');
  }

  // Statistiques pour le Back-Office (KPIs)
  getKPIs() {
    const reussies = this.transactions.filter(t => t.statut === 'reussi');
    const totalEncaisse = reussies.reduce((sum, t) => sum + t.montant, 0);
    const enAttente = this.transactions.filter(t => t.statut === 'en_attente').length;
    const echouees = this.transactions.filter(t => t.statut === 'echoue' || t.statut === 'annule').length;
    const totalTransactions = this.transactions.length;
    const tauxReussite = totalTransactions > 0 ? Math.round((reussies.length / totalTransactions) * 100) : 0;

    // Répartition par opérateur
    const statsOperateurs = {};
    this.operateurs.forEach(op => {
      const count = reussies.filter(t => t.operateur === op.id).length;
      const totalOp = reussies.filter(t => t.operateur === op.id).reduce((s, t) => s + t.montant, 0);
      statsOperateurs[op.id] = { count, totalOp };
    });

    return {
      totalEncaisse,
      totalTransactions,
      nbReussies: reussies.length,
      enAttente,
      echouees,
      tauxReussite,
      statsOperateurs
    };
  }
}

export const store = new Store();
