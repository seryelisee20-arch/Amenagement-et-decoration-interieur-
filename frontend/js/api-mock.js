/**
 * ORCA Déco CI - Passerelle & Simulateur d'API Mobile Money
 * Conforme aux exigences RF01 à RF07 et scénarios de test (Slide 12)
 */

import { store } from './store.js';

export const SCENARIOS_SIMULATION = {
  SUCCES: 'succes',
  SOLDE_INSUFFISANT: 'solde_insuffisant',
  TIMEOUT_ATTENTE: 'timeout_attente',
  ANNULATION_CLIENT: 'annulation_client',
  DOUBLON_IDEMPOTENCE: 'doublon_idempotence',
  INTERRUPTION_RESEAU: 'interruption_reseau'
};

class ApiMobileMoneyMock {
  constructor() {
    this.scenarioActif = SCENARIOS_SIMULATION.SUCCES;
    this.delaiReponseMs = 3000; // 3 secondes pour un réalisme parfait
    this.historiqueRequetes = [];
  }

  setScenario(scenario) {
    this.scenarioActif = scenario;
  }

  setDelai(delaiMs) {
    this.delaiReponseMs = delaiMs;
  }

  logRequete(type, url, payload, reponse, codeHttp) {
    const logEntry = {
      timestamp: new Date().toLocaleTimeString('fr-FR'),
      type,
      url,
      payload,
      reponse,
      codeHttp
    };
    this.historiqueRequetes.unshift(logEntry);
    store.notifier('api_log', logEntry);
    return logEntry;
  }

  /**
   * RF02 : Initialisation de la demande de paiement
   */
  async initierPaiement(transaction, scenarioForce = null) {
    const scenario = scenarioForce || this.scenarioActif;
    const url = `https://api.gateway-ci.orca-deco.com/v1/payments/${transaction.operateur}/initiate`;

    const payload = {
      internal_reference: transaction.refVente,
      payment_id: transaction.id,
      amount: transaction.montant,
      currency: 'XOF',
      client_msisdn: transaction.client.telephone,
      client_name: transaction.client.nom,
      callback_url: 'https://gestion.orcadeco.ci/api/webhook/momo',
      idempotency_key: `IDEM-${transaction.refVente}-${transaction.montant}`
    };

    // Test d'Idempotence (RF02 / Slide 12)
    if (scenario === SCENARIOS_SIMULATION.DOUBLON_IDEMPOTENCE) {
      await this.attendre(1200);
      const reponse = {
        status: 'REJECTED_DUPLICATE',
        message: 'Cette vente a déjà fait l’objet d’un règlement confirmé. Double débit bloqué.',
        transaction_id: transaction.id,
        ref_externe: transaction.refExterne
      };
      this.logRequete('POST', url, payload, reponse, 409);
      store.mettreAJourStatutTransaction(
        transaction.id,
        'annule',
        '409_DUPLICATE_REQUEST',
        'Tentative de doublon interceptée : le paiement n’est pas comptabilisé deux fois.'
      );
      return { succes: false, erreur: reponse.message, code: 409 };
    }

    // Début d'attente réseau
    this.logRequete('POST', url, payload, { status: 'PENDING_USER_AUTH' }, 202);

    await this.attendre(this.delaiReponseMs);

    // Résolution selon le scénario
    switch (scenario) {
      case SCENARIOS_SIMULATION.SUCCES: {
        const reponse = {
          status: 'SUCCESS',
          operator_transaction_id: transaction.refExterne,
          amount_settled: transaction.montant,
          currency: 'XOF',
          timestamp: new Date().toISOString()
        };
        this.logRequete('WEBHOOK', 'https://gestion.orcadeco.ci/api/webhook/momo', reponse, { acknowledged: true }, 200);
        
        store.mettreAJourStatutTransaction(
          transaction.id,
          'reussi',
          '200_SUCCESS',
          `Paiement validé par ${transaction.operateur.toUpperCase()}. Vente confirmée et marquée PAYÉE.`
        );
        return { succes: true, reponse };
      }

      case SCENARIOS_SIMULATION.SOLDE_INSUFFISANT: {
        const reponse = {
          status: 'FAILED',
          error_code: 'ERR_INSUFFICIENT_FUNDS',
          message: 'Solde du compte Mobile Money insuffisant pour finaliser l’achat.',
          operator_transaction_id: transaction.refExterne
        };
        this.logRequete('WEBHOOK', 'https://gestion.orcadeco.ci/api/webhook/momo', reponse, { acknowledged: true }, 402);
        
        store.mettreAJourStatutTransaction(
          transaction.id,
          'echoue',
          '402_INSUFFICIENT_FUNDS',
          'Échec du débit : Solde insuffisant. La vente reste NON PAYÉE.'
        );
        return { succes: false, erreur: reponse.message, code: 402 };
      }

      case SCENARIOS_SIMULATION.ANNULATION_CLIENT: {
        const reponse = {
          status: 'CANCELLED',
          error_code: 'USER_REJECTED',
          message: 'L’utilisateur a refusé la transaction sur son téléphone mobile.',
          operator_transaction_id: transaction.refExterne
        };
        this.logRequete('WEBHOOK', 'https://gestion.orcadeco.ci/api/webhook/momo', reponse, { acknowledged: true }, 403);
        
        store.mettreAJourStatutTransaction(
          transaction.id,
          'annule',
          '403_USER_REJECTED',
          'Transaction annulée par l’acheteur sur son smartphone.'
        );
        return { succes: false, erreur: reponse.message, code: 403 };
      }

      case SCENARIOS_SIMULATION.INTERRUPTION_RESEAU: {
        const reponse = {
          status: 'TIMEOUT',
          error_code: 'NETWORK_DROPPED',
          message: 'Délai d’attente dépassé sans confirmation de l’opérateur.'
        };
        this.logRequete('GET', `${url}/status`, payload, reponse, 504);
        
        store.mettreAJourStatutTransaction(
          transaction.id,
          'en_attente',
          '504_TIMEOUT',
          'Connexion interrompue : Statut non supposé réussi. Conservé EN ATTENTE pour vérification ultérieure.'
        );
        return { succes: false, attente: true, erreur: reponse.message, code: 504 };
      }

      case SCENARIOS_SIMULATION.TIMEOUT_ATTENTE:
      default: {
        const reponse = {
          status: 'PENDING',
          message: 'Transaction en cours d’autorisation par l’opérateur.',
          operator_transaction_id: transaction.refExterne
        };
        store.mettreAJourStatutTransaction(
          transaction.id,
          'en_attente',
          '202_PENDING_CLIENT',
          'Le client n’a pas encore validé son code secret. Statut conservé EN ATTENTE.'
        );
        return { succes: false, attente: true, reponse };
      }
    }
  }

  /**
   * RF07 & Rapprochement : Vérification manuelle ou asynchrone auprès de l'API de l'opérateur
   */
  async interrogerStatut(transactionId) {
    const t = store.transactions.find(item => item.id === transactionId);
    if (!t) return null;

    const url = `https://api.gateway-ci.orca-deco.com/v1/payments/${t.operateur}/status/${t.refExterne}`;
    await this.attendre(1500);

    // Si la transaction était en attente, le rapprochement permet de la débloquer en succès
    let nouveauStatut = t.statut;
    let code = t.codeReponse;
    let message = '';

    if (t.statut === 'en_attente') {
      nouveauStatut = 'reussi';
      code = '200_RESOLVED_MANUAL';
      message = `Rapprochement réussi auprès de l'API ${t.operateur.toUpperCase()}. Vente confirmée payée.`;
    } else {
      message = `Vérification API confirmant l’état actuel : ${t.statut.toUpperCase()}`;
    }

    const reponse = {
      operator_ref: t.refExterne,
      verified_status: nouveauStatut,
      amount: t.montant,
      matched: true
    };

    this.logRequete('GET', url, { transaction_id: t.id }, reponse, 200);

    if (t.statut === 'en_attente') {
      store.mettreAJourStatutTransaction(t.id, nouveauStatut, code, message);
    }

    return reponse;
  }

  attendre(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const apiMock = new ApiMobileMoneyMock();
