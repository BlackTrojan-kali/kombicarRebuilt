// src/types/WalletTypes.ts

// ==========================================
// --- DÉPÔTS (DEPOSITS) ---
// ==========================================

export interface DepositInitPayload {
  amount: number;
  operator: number;
  phoneNumber: string;
  returnUrl: string;
}

export interface DepositInitResponse {
  isPaid: boolean;
  paymentUrl: string;
  externalTransactionId: string;
  message: string;
  actionType: string;
}

export interface TransactionItem {
  id: number;
  externalId: string;
  userId: string;
  tripId: number;
  vtcRideId: string;
  reservationId: number;
  amount: number;
  country: number;
  phoneNumber: string;
  operator: number;
  status: number;
  type: number;
  finishedAt: string;
  financialProcessedAt: string;
  currency: number;
  createdAt: string;
  reduction: number;
  paidLink: string;
  paidToken: string;
}

// ==========================================
// --- RETRAITS (WITHDRAWS) ---
// ==========================================

export interface WithdrawRequestPayload {
  amount: number;
  phoneNumber: string;
  operator: number;
}

export interface WithdrawRequestItem {
  id: number;
  userId: string;
  amount: number;
  phoneNumber: string;
  operator: number;
  requestedAt: string;
  processedAt: string;
  transactionId: number;
  servicePart: number;
  rejectReason: string;
  status: number;
  country: number;
}