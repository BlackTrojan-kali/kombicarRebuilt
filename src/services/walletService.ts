// src/services/walletService.ts
import api from '../config/api';
import type { PaginatedResponse } from '../types/TripTypes'; // Assure-toi que le chemin est correct selon ton projet
import type {
  DepositInitPayload,
  DepositInitResponse,
  TransactionItem,
  WithdrawRequestPayload,
  WithdrawRequestItem
} from '../types/WalletTypes';

export const walletService = {

  // ==========================================================
  // --- GESTION DES DÉPÔTS ---
  // ==========================================================

  /**
   * Initie un dépôt sur le wallet de l'utilisateur connecté via l'orchestrateur universel.
   * Method: POST
   * Endpoint: /v1/wallet/deposits/init
   */
  initDeposit: async (payload: DepositInitPayload): Promise<DepositInitResponse> => {
    const response = await api.post<DepositInitResponse>('/v1/wallet/deposits/init', payload);
    return response.data;
  },

  /**
   * Récupère l'historique paginé des dépôts/transactions de l'utilisateur.
   * Method: GET
   * Endpoint: /v1/wallet/deposits/my/{page}
   */
  getMyDeposits: async (page: number): Promise<PaginatedResponse<TransactionItem>> => {
    const response = await api.get<PaginatedResponse<TransactionItem>>(`/v1/wallet/deposits/my/${page}`);
    return response.data;
  },


  // ==========================================================
  // --- GESTION DES RETRAITS ---
  // ==========================================================

  /**
   * Soumet une nouvelle demande de retrait.
   * Le montant est immédiatement déduit du solde et mis en attente de validation.
   * Method: POST
   * Endpoint: /v1/withdraws
   */
  requestWithdraw: async (payload: WithdrawRequestPayload): Promise<void> => {
    const response = await api.post('/v1/withdraws', payload);
    return response.data;
  },

  /**
   * Récupère l'historique paginé des demandes de retrait de l'utilisateur.
   * Method: GET
   * Endpoint: /v1/withdraws/my-requests/{page}
   */
  getMyWithdrawRequests: async (page: number): Promise<PaginatedResponse<WithdrawRequestItem>> => {
    const response = await api.get<PaginatedResponse<WithdrawRequestItem>>(`/v1/withdraws/my-requests/${page}`);
    return response.data;
  },

  /**
   * Récupère les détails d'une demande de retrait spécifique de l'utilisateur.
   * Method: GET
   * Endpoint: /v1/withdraws/{requestId}
   */
  getWithdrawRequestDetails: async (requestId: number): Promise<WithdrawRequestItem> => {
    const response = await api.get<WithdrawRequestItem>(`/v1/withdraws/${requestId}`);
    return response.data;
  }

};