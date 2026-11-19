/**
 * ORCA DÉCO CI - Contrôleur Principal (Conforme à la Maquette Figma)
 * Projet L3 Génie Logiciel - Atelier du logiciel
 */

import { store } from './store.js';
import { apiMock, SCENARIOS_SIMULATION } from './api-mock.js';

export const formatFCFA = (valeur) => {
  return new Intl.NumberFormat('fr-FR').format(valeur) + ' FCFA';
};

class FigmaAppController {
  constructor() {
    this.pageActive = 'overview';
    this.operateurActif = 'wave';
    this.montantCommande = 387000;
  }

  init() {
    this.lierElements();
    this.attacherEvenements();
    this.render();

    // Abonnement aux changements du Store
    store.abonner((evt, payload) => {
      this.render();
      if (evt === 'api_log') {
        this.renderLogTerminal(payload);
      }
    });

    this.initialiserTerminalLogs();
  }

  lierElements() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.pageViews = document.querySelectorAll('.page-view');
    this.topBarTitle = document.getElementById('topBarTitle');
    this.topBarSubtitle = document.getElementById('topBarSubtitle');
    this.btnQuickReset = document.getElementById('btnQuickReset');
    this.resultModal = document.getElementById('resultModal');
  }

  attacherEvenements() {
    // Navigation dans la barre latérale
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const page = link.dataset.page;
        this.navigate(page);
      });
    });

    // Réinitialisation rapide
    if (this.btnQuickReset) {
      this.btnQuickReset.addEventListener('click', () => {
        store.reinitialiserDonnees();
        this.render();
        alert('Données réinitialisées au modèle initial !');
      });
    }

    // Sélection des opérateurs dans l'espace client (Figma)
    const opCards = document.querySelectorAll('.operator-option-card');
    opCards.forEach(card => {
      card.addEventListener('click', () => {
        opCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.operateurActif = card.dataset.op;
        this.mettreAJourBoutonPaiement();
      });
    });

    // Soumission du paiement
    const btnSubmit = document.getElementById('btnSubmitPayment');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => this.lancerPaiement());
    }

    // Filtres transactions
    document.getElementById('transactionsSearchInput')?.addEventListener('input', () => this.renderTransactions());
    document.getElementById('transactionsStatusFilter')?.addEventListener('change', () => this.renderTransactions());
    document.getElementById('transactionsOpFilter')?.addEventListener('change', () => this.renderTransactions());
    document.getElementById('btnExportTransactions')?.addEventListener('click', () => this.exporterTransactionsCsv());

    // Clic pour fermer modale
    this.resultModal?.addEventListener('click', (e) => {
      if (e.target === this.resultModal) {
        this.resultModal.classList.remove('active');
      }
    });
  }

  navigate(pageId) {
    this.pageActive = pageId;

    this.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });

    this.pageViews.forEach(view => {
      view.classList.toggle('active', view.id === `page-${pageId}`);
    });

    // Mettre à jour l'en-tête
    const titres = {
      overview: {
        title: "Vue d'ensemble",
        subtitle: "Suivi des encaissements Mobile Money pour ORCA Déco Marcory"
      },
      checkout: {
        title: "Espace client",
        subtitle: "Finalisez votre commande de mobilier en toute sérénité"
      },
      transactions: {
        title: "Transactions",
        subtitle: "Historique exhaustif et audit des règlements Mobile Money"
      },
      reports: {
        title: "Rapports",
        subtitle: "Analyse des performances et ventilation par opérateur"
      },
      simulator: {
        title: "Simulateur API (L3)",
        subtitle: "Validation académique des critères d'acceptation (Slide 12)"
      }
    };

    const info = titres[pageId] || titres.overview;
    if (this.topBarTitle) this.topBarTitle.textContent = info.title;
    if (this.topBarSubtitle) this.topBarSubtitle.textContent = info.subtitle;

    this.render();
  }

  render() {
    this.renderKPIs();
    this.renderOverviewTable();
    this.renderCheckoutArticles();
    this.renderTransactions();
    this.renderRapports();
    this.renderSimulateur();
  }

  // --- RENDU DES KPIS (VUE D'ENSEMBLE) ---
  renderKPIs() {
    const kpis = store.getKPIs();

    // Overview KPIs
    const elCount = document.getElementById('kpiTotalCount');
    const elPending = document.getElementById('kpiPendingCount');
    const elFailed = document.getElementById('kpiFailedCount');
    const elAmount = document.getElementById('kpiTotalAmount');

    if (elCount) elCount.textContent = kpis.totalTransactions;
    if (elPending) elPending.textContent = kpis.enAttente;
    if (elFailed) elFailed.textContent = kpis.echouees;
    if (elAmount) elAmount.textContent = formatFCFA(kpis.totalEncaisse || 387000);

    // Reports KPIs
    const repAmount = document.getElementById('repTotalAmount');
    const repSuccess = document.getElementById('repSuccessCount');
    const repPending = document.getElementById('repPendingCount');
    const repFailed = document.getElementById('repFailedCount');

    if (repAmount) repAmount.textContent = formatFCFA(kpis.totalEncaisse || 387000);
    if (repSuccess) repSuccess.textContent = kpis.nbReussies;
    if (repPending) repPending.textContent = kpis.enAttente;
    if (repFailed) repFailed.textContent = kpis.echouees;
  }

  // --- DERNIÈRES TRANSACTIONS (VUE D'ENSEMBLE) ---
  renderOverviewTable() {
    const tbody = document.getElementById('overviewTableBody');
    if (!tbody) return;

    const items = store.transactions.slice(0, 5);

    tbody.innerHTML = items.map(t => {
      const opBadgeClass = `op-icon-${t.operateur}`;
      const opNom = {
        wave: 'Wave',
        orange: 'Orange Money',
        mtn: 'MTN MoMo',
        moov: 'Moov Money'
      }[t.operateur] || t.operateur;

      const statutLibelle = {
        reussi: 'Validé',
        en_attente: 'En attente',
        echoue: 'Échoué',
        annule: 'Annulé'
      }[t.statut] || t.statut;

      return `
        <tr>
          <td><strong>${t.refVente}</strong></td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="op-icon-badge ${opBadgeClass}" style="width: 22px; height: 22px; font-size: 0.65rem; border-radius: 4px;">
                ${t.operateur.substring(0, 2).toUpperCase()}
              </span>
              <span>${opNom}</span>
            </div>
          </td>
          <td><strong>${formatFCFA(t.montant)}</strong></td>
          <td>
            <span class="status-pill ${t.statut}">${statutLibelle}</span>
          </td>
        </tr>
      `;
    }).join('');
  }

  // --- ARTICLES DANS L'ESPACE CLIENT ---
  renderCheckoutArticles() {
    const container = document.getElementById('checkoutItemsList');
    if (!container) return;

    const articles = [
      {
        nom: "Canapé d'Angle Velours Assinie",
        desc: "Coloris Bleu Nuit • 5 places modulable",
        prix: 280000,
        img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80"
      },
      {
        nom: "Table Basse Marbre & Chêne Bietry",
        desc: "Plateau biseauté • Piétement doré",
        prix: 107000,
        img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=200&auto=format&fit=crop&q=80"
      }
    ];

    container.innerHTML = articles.map(art => `
      <div class="product-item-row">
        <img src="${art.img}" class="product-thumb" alt="${art.nom}" onerror="this.src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&auto=format&fit=crop&q=80'" />
        <div style="flex: 1;">
          <div class="product-name">${art.nom}</div>
          <div class="product-sub">${art.desc}</div>
        </div>
        <div style="font-weight: 700; font-size: 0.9rem;">
          ${formatFCFA(art.prix)}
        </div>
      </div>
    `).join('');

    this.mettreAJourBoutonPaiement();
  }

  mettreAJourBoutonPaiement() {
    const btn = document.getElementById('btnSubmitPayment');
    if (!btn) return;

    const nomOp = {
      wave: 'Wave',
      orange: 'Orange Money',
      mtn: 'MTN Mobile Money',
      moov: 'Moov Money'
    }[this.operateurActif] || 'Mobile Money';

    btn.textContent = `Payer ${formatFCFA(this.montantCommande)} avec ${nomOp}`;
  }

  // --- TRAITEMENT DU PAIEMENT (BOUTIQUE / ESPACE CLIENT) ---
  async lancerPaiement() {
    const tel = document.getElementById('checkoutPhoneInput')?.value || '07 00 00 00';
    const btn = document.getElementById('btnSubmitPayment');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Traitement de la transaction...';
    }

    // 1. Créer la transaction dans le Store
    const transaction = store.creerTransaction({
      canal: 'en_ligne',
      montant: this.montantCommande,
      client: {
        nom: 'Client ORCA',
        telephone: '+225 ' + tel,
        adresse: 'Marcory Zone 4, Abidjan'
      },
      operateur: this.operateurActif,
      articles: [
        { id: 'ORC-001', nom: "Canapé d'Angle Assinie", qte: 1, prix: 280000 },
        { id: 'ORC-002', nom: "Table Basse Bietry", qte: 1, prix: 107000 }
      ],
      vendeur: 'Espace Client ORCA Déco'
    });

    // 2. Appel API Mock (avec le scénario actif)
    const res = await apiMock.initierPaiement(transaction);

    if (btn) {
      btn.disabled = false;
      this.mettreAJourBoutonPaiement();
    }

    // 3. Afficher la modale de résultat
    this.afficherResultat(transaction, res);
  }

  afficherResultat(transaction, res) {
    const modal = this.resultModal;
    const body = document.getElementById('resultModalBody');
    if (!modal || !body) return;

    if (res.succes) {
      body.innerHTML = `
        <div style="text-align: center;">
          <img src="assets/logo_orca_deco.png" alt="ORCA DÉCO" style="height: 46px; margin-bottom: 14px; object-fit: contain;" />
          <div style="width: 44px; height: 44px; background: #ecfdf5; color: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 1.3rem;">
            ✓
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 6px;">Paiement confirmé !</h3>
          <p style="font-size: 0.85rem; color: #6b7280; margin-bottom: 20px;">
            Votre règlement a été validé par <strong>${transaction.operateur.toUpperCase()}</strong>.<br>
            Référence Vente : <strong>${transaction.refVente}</strong>
          </p>

          <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; text-align: left; font-size: 0.82rem; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #6b7280;">Montant débité :</span>
              <strong>${formatFCFA(transaction.montant)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: #6b7280;">Réf. externe opérateur :</span>
              <code>${transaction.refExterne}</code>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Livraison & montage :</span>
              <span style="color: #059669; font-weight: 600;">Offerts (ORCA Marcory)</span>
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-black" style="flex: 1;" onclick="window.print()">
              🖨️ Imprimer le reçu
            </button>
            <button class="btn btn-white" onclick="document.getElementById('resultModal').classList.remove('active')">
              Fermer
            </button>
          </div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div style="text-align: center;">
          <div style="width: 52px; height: 52px; background: #fef2f2; color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.5rem;">
            ✕
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 6px; color: #b91c1c;">Paiement non finalisé</h3>
          <p style="font-size: 0.85rem; color: #4b5563; margin-bottom: 20px;">
            ${res.erreur || 'L’opération a été refusée ou interrompue.'}
          </p>
          <div style="background: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 12px; font-size: 0.8rem; color: #991b1b; text-align: left; margin-bottom: 20px;">
            Règle RF04 : La vente <strong>${transaction.refVente}</strong> reste non payée et aucun article n'a été décompté.
          </div>
          <button class="btn btn-black" style="width: 100%;" onclick="document.getElementById('resultModal').classList.remove('active')">
            Compris
          </button>
        </div>
      `;
    }

    modal.classList.add('active');
  }

  // --- HISTORIQUE TRANSACTIONS (PAGE 3 FIGMA) ---
  renderTransactions() {
    const tbody = document.getElementById('fullTransactionsTableBody');
    if (!tbody) return;

    const filtreTexte = document.getElementById('transactionsSearchInput')?.value.toLowerCase() || '';
    const filtreStatut = document.getElementById('transactionsStatusFilter')?.value || 'tous';
    const filtreOp = document.getElementById('transactionsOpFilter')?.value || 'tous';

    const liste = store.transactions.filter(t => {
      if (filtreStatut !== 'tous' && t.statut !== filtreStatut) return false;
      if (filtreOp !== 'tous' && t.operateur !== filtreOp) return false;
      if (filtreTexte) {
        const full = `${t.id} ${t.refVente} ${t.refExterne} ${t.client.nom} ${t.client.telephone}`.toLowerCase();
        if (!full.includes(filtreTexte)) return false;
      }
      return true;
    });

    if (liste.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 30px; color: #9ca3af;">
            Aucune transaction trouvée pour ces critères.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = liste.map(t => {
      const opBadgeClass = `op-icon-${t.operateur}`;
      const opNom = {
        wave: 'Wave',
        orange: 'Orange Money',
        mtn: 'MTN MoMo',
        moov: 'Moov Money'
      }[t.operateur] || t.operateur;

      const statutLibelle = {
        reussi: 'Validé',
        en_attente: 'En attente',
        echoue: 'Échoué',
        annule: 'Annulé'
      }[t.statut] || t.statut;

      return `
        <tr>
          <td><strong>${t.refVente}</strong><br><span style="font-size: 0.72rem; color: #9ca3af;">${t.id}</span></td>
          <td>${new Date(t.date).toLocaleDateString('fr-FR')} ${new Date(t.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</td>
          <td>${t.client.nom}<br><span style="font-size: 0.72rem; color: #6b7280;">${t.client.telephone}</span></td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="op-icon-badge ${opBadgeClass}" style="width: 20px; height: 20px; font-size: 0.6rem; border-radius: 4px;">
                ${t.operateur.substring(0, 2).toUpperCase()}
              </span>
              <span>${opNom}</span>
            </div>
          </td>
          <td><strong>${formatFCFA(t.montant)}</strong></td>
          <td><span class="status-pill ${t.statut}">${statutLibelle}</span></td>
          <td>
            ${t.statut === 'en_attente' ? `
              <button class="btn btn-white btn-reconcile" data-id="${t.id}" style="padding: 4px 8px; font-size: 0.75rem;">
                Vérifier API
              </button>
            ` : `
              <button class="btn btn-white btn-receipt" data-id="${t.id}" style="padding: 4px 8px; font-size: 0.75rem;">
                Reçu
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.btn-reconcile').forEach(b => {
      b.addEventListener('click', async () => {
        b.disabled = true;
        b.textContent = 'Vérification...';
        await apiMock.interrogerStatut(b.dataset.id);
        this.render();
      });
    });

    tbody.querySelectorAll('.btn-receipt').forEach(b => {
      b.addEventListener('click', () => {
        const t = store.transactions.find(item => item.id === b.dataset.id);
        if (t) this.afficherResultat(t, { succes: t.statut === 'reussi' });
      });
    });
  }

  exporterTransactionsCsv() {
    const entetes = ['Ref_Vente', 'ID_Paiement', 'Date', 'Client', 'Telephone', 'Operateur', 'Montant_FCFA', 'Statut', 'Ref_Externe'];
    const lignes = store.transactions.map(t => [
      t.refVente,
      t.id,
      t.date,
      `"${t.client.nom}"`,
      t.client.telephone,
      t.operateur,
      t.montant,
      t.statut,
      t.refExterne
    ]);

    const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [entetes.join(';'), ...lignes.map(e => e.join(';'))].join('\n');
    const encoded = encodeURI(csv);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `ORCA_Deco_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // --- RAPPORTS (PAGE 4 FIGMA) ---
  renderRapports() {
    const kpis = store.getKPIs();
    const total = kpis.totalEncaisse || 387000;

    const waveTotal = kpis.statsOperateurs.wave?.totalOp || 174150;
    const orangeTotal = kpis.statsOperateurs.orange?.totalOp || 116100;
    const mtnTotal = kpis.statsOperateurs.mtn?.totalOp || 58050;
    const moovTotal = kpis.statsOperateurs.moov?.totalOp || 38700;

    const wavePct = total > 0 ? Math.round((waveTotal / total) * 100) : 45;
    const orangePct = total > 0 ? Math.round((orangeTotal / total) * 100) : 30;
    const mtnPct = total > 0 ? Math.round((mtnTotal / total) * 100) : 15;
    const moovPct = total > 0 ? Math.round((moovTotal / total) * 100) : 10;

    const wEl = document.getElementById('repWavePercent');
    const oEl = document.getElementById('repOrangePercent');
    const mEl = document.getElementById('repMtnPercent');
    const movEl = document.getElementById('repMoovPercent');

    if (wEl) wEl.textContent = `${wavePct}% (${formatFCFA(waveTotal)})`;
    if (oEl) oEl.textContent = `${orangePct}% (${formatFCFA(orangeTotal)})`;
    if (mEl) mEl.textContent = `${mtnPct}% (${formatFCFA(mtnTotal)})`;
    if (movEl) movEl.textContent = `${moovPct}% (${formatFCFA(moovTotal)})`;
  }

  // --- SIMULATEUR API & LOGS ---
  renderSimulateur() {
    const container = document.getElementById('simScenarioList');
    if (!container) return;

    const scenarios = [
      {
        id: SCENARIOS_SIMULATION.SUCCES,
        name: 'Scénario 1 : Paiement Réussi (Nominal)',
        desc: 'L’opérateur confirme le débit. La vente passe à PAYÉE immédiatement.'
      },
      {
        id: SCENARIOS_SIMULATION.SOLDE_INSUFFISANT,
        name: 'Scénario 2 : Refus Solde Insuffisant (RF06)',
        desc: 'Rejet 402. La vente reste NON PAYÉE, message d’explication clair.'
      },
      {
        id: SCENARIOS_SIMULATION.TIMEOUT_ATTENTE,
        name: 'Scénario 3 : En Attente de Confirmation (RF03)',
        desc: 'Le client tarde à taper son PIN. Statut conservé EN ATTENTE.'
      },
      {
        id: SCENARIOS_SIMULATION.DOUBLON_IDEMPOTENCE,
        name: 'Scénario 4 : Doublon / Idempotence (Critère Slide 12)',
        desc: 'Deux requêtes identiques. La transaction n’est pas débitée 2 fois.'
      },
      {
        id: SCENARIOS_SIMULATION.INTERRUPTION_RESEAU,
        name: 'Scénario 5 : Interruption Réseau / Timeout',
        desc: 'Statut incertain : conservé en attente de réconciliation.'
      }
    ];

    container.innerHTML = scenarios.map(sc => `
      <div class="scenario-card-btn ${apiMock.scenarioActif === sc.id ? 'active' : ''}" data-sc="${sc.id}">
        <span class="scenario-name">${sc.name}</span>
        <span class="scenario-desc">${sc.desc}</span>
      </div>
    `).join('');

    container.querySelectorAll('.scenario-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sc = btn.dataset.sc;
        apiMock.setScenario(sc);
        container.querySelectorAll('.scenario-card-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        apiMock.logRequete('CONFIG', 'SIMULATEUR', { scenario_choisi: sc }, { status: 'Actif pour le prochain paiement' }, 200);
      });
    });
  }

  initialiserTerminalLogs() {
    apiMock.logRequete('INIT', 'https://api.orcadeco.ci/v1/gateway', { etablissement: 'IIT 2026-2027', marcory: true }, { operateurs: ['Wave', 'Orange', 'MTN', 'Moov'] }, 200);
  }

  renderLogTerminal(log) {
    const list = document.getElementById('terminalLogsList');
    if (!list) return;

    const div = document.createElement('div');
    div.className = `terminal-log-entry code-${log.codeHttp}`;
    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
        <span style="color: #38bdf8;"><strong>${log.type}</strong> ${log.url}</span>
        <span style="color: #94a3b8;">${log.timestamp} • HTTP ${log.codeHttp}</span>
      </div>
      <div>
        <pre style="margin: 0; color: #cbd5e1; font-family: inherit;">${JSON.stringify(log.reponse, null, 2)}</pre>
      </div>
    `;

    list.prepend(div);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new FigmaAppController();
  app.init();
  window.orcaApp = app;
});
