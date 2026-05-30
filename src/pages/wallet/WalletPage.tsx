// src/pages/wallet/WalletPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Wallet, ArrowDownToLine, ArrowUpFromLine, 
  Clock, CheckCircle2, XCircle, Loader2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../features/auth/AuthContext';
import { walletService } from '../../services/walletService';
import type { TransactionItem, WithdrawRequestItem } from '../../types/WalletTypes';

// --- HELPERS POUR LES STATUTS ---
const getTransactionStatus = (status: number) => {
  switch (status) {
    case 0: return { label: 'En attente', color: 'text-yellow-600 bg-yellow-50', icon: Clock };
    case 1: return { label: 'Réussi', color: 'text-green-600 bg-green-50', icon: CheckCircle2 };
    case 2: return { label: 'Échoué / Refusé', color: 'text-red-600 bg-red-50', icon: XCircle };
    default: return { label: 'Inconnu', color: 'text-gray-600 bg-gray-50', icon: AlertCircle };
  }
};

export const WalletPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // On suppose que le solde (balance) est dans l'objet user, sinon à adapter
  
  // États de navigation
  const [activeTab, setActiveTab] = useState<'deposits' | 'withdraws'>('deposits');
  
  // États des données
  const [deposits, setDeposits] = useState<TransactionItem[]>([]);
  const [withdraws, setWithdraws] = useState<WithdrawRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ hasNext: false, hasPrev: false, total: 0 });

  // États des Modales
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // --- CHARGEMENT DES DONNÉES ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'deposits') {
        const res = await walletService.getMyDeposits(currentPage);
        setDeposits(res.items || []);
        setPaginationMeta({ hasNext: res.hasNextPage, hasPrev: res.hasPreviousPage, total: res.totalCount });
      } else {
        const res = await walletService.getMyWithdrawRequests(currentPage);
        setWithdraws(res.items || []);
        setPaginationMeta({ hasNext: res.hasNextPage, hasPrev: res.hasPreviousPage, total: res.totalCount });
      }
    } catch (error) {
      toast.error("Erreur lors du chargement de l'historique.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  const handleTabChange = (tab: 'deposits' | 'withdraws') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-base pb-24">
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-surface border-b border-border-main shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-main hover:bg-base transition-colors shrink-0"
          >
            <ChevronLeft size={20} className="text-text-main" />
          </button>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Wallet className="text-kombi-orange-500" size={20} /> Mon Portefeuille
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        
        {/* CARTE DE SOLDE */}
        <div className="bg-gradient-to-br from-gray-900 to-kombi-dark-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-kombi-orange-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-gray-300 text-sm font-medium mb-1">Solde disponible</p>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {user?.walletBalance ? user.walletBalance.toLocaleString('fr-FR') : '0'} <span className="text-lg font-bold text-gray-400">XAF</span>
            </h2>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="flex-1 bg-kombi-orange-500 hover:bg-kombi-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <ArrowDownToLine size={18} /> Recharger
              </button>
              <button 
                onClick={() => setIsWithdrawModalOpen(true)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowUpFromLine size={18} /> Retirer
              </button>
            </div>
          </div>
        </div>

        {/* ONGLETS */}
        <div className="flex gap-2 overflow-x-auto border-b border-border-main pb-px">
          <button
            onClick={() => handleTabChange('deposits')}
            className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'deposits' 
                ? 'border-kombi-orange-500 text-kombi-orange-500' 
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            Historique des rechargements
          </button>
          <button
            onClick={() => handleTabChange('withdraws')}
            className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'withdraws' 
                ? 'border-kombi-orange-500 text-kombi-orange-500' 
                : 'border-transparent text-text-muted hover:text-text-main'
            }`}
          >
            Demandes de retrait
          </button>
        </div>

        {/* LISTES */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={40} className="text-kombi-orange-500 animate-spin" />
            </div>
          ) : activeTab === 'deposits' ? (
            // --- LISTE DES DÉPÔTS ---
            deposits.length > 0 ? (
              deposits.map((item) => {
                const StatusInfo = getTransactionStatus(item.status);
                const date = new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={item.id} className="bg-surface border border-border-main rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center shrink-0">
                        <ArrowDownToLine size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-text-main text-sm">Rechargement {item.operator === 1 ? 'Orange' : item.operator === 2 ? 'MTN' : 'Cinetpay'}</p>
                        <p className="text-xs text-text-muted">{date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-text-main text-base">+{item.amount.toLocaleString('fr-FR')} XAF</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 ${StatusInfo.color}`}>
                        <StatusInfo.icon size={10} /> {StatusInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-text-muted py-8">Aucun rechargement trouvé.</p>
            )
          ) : (
            // --- LISTE DES RETRAITS ---
            withdraws.length > 0 ? (
              withdraws.map((item) => {
                const StatusInfo = getTransactionStatus(item.status);
                const date = new Date(item.requestedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={item.id} className="bg-surface border border-border-main rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-kombi-orange-500 flex items-center justify-center shrink-0">
                        <ArrowUpFromLine size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-text-main text-sm">Retrait vers {item.phoneNumber}</p>
                        <p className="text-xs text-text-muted">{date}</p>
                        {item.rejectReason && <p className="text-[10px] text-red-500 mt-0.5">Motif: {item.rejectReason}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-text-main text-base">-{item.amount.toLocaleString('fr-FR')} XAF</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 ${StatusInfo.color}`}>
                        <StatusInfo.icon size={10} /> {StatusInfo.label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-text-muted py-8">Aucune demande de retrait trouvée.</p>
            )
          )}

          {/* PAGINATION */}
          {(paginationMeta.hasNext || paginationMeta.hasPrev) && (
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={!paginationMeta.hasPrev}
                className="px-4 py-2 border rounded-xl font-bold disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={!paginationMeta.hasNext}
                className="px-4 py-2 border rounded-xl font-bold disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODALES INTEGREES */}
      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
        onSuccess={() => { setIsDepositModalOpen(false); fetchData(); }} 
      />
      <WithdrawModal 
        isOpen={isWithdrawModalOpen} 
        onClose={() => setIsWithdrawModalOpen(false)} 
        onSuccess={() => { setIsWithdrawModalOpen(false); fetchData(); }} 
      />
    </div>
  );
};


// ==========================================
// --- COMPOSANT : MODALE DE RECHARGEMENT ---
// ==========================================
const DepositModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [operator, setOperator] = useState(0); // 0 = Cinetpay Universel, 1 = Orange, 2 = MTN
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) < 500) return toast.error("Le montant minimum est de 500 XAF.");

    setIsSubmitting(true);
    try {
      const response = await walletService.initDeposit({
        amount: Number(amount),
        phoneNumber: phone,
        operator,
        returnUrl: `${window.location.origin}/wallet?status=success`
      });

      if (response.paymentUrl) {
        toast.loading("Redirection vers la plateforme de paiement...");
        window.location.href = response.paymentUrl; // Redirection vers Cinetpay
      } else {
        toast.success(response.message || "Opération initiée avec succès.");
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.description || "Erreur lors de l'initiation du dépôt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-surface w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ArrowDownToLine className="text-kombi-orange-500"/> Recharger</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase">Montant (XAF)</label>
            <input type="number" required min="500" value={amount} onChange={e => setAmount(e.target.value)} className="w-full mt-1 p-3 border rounded-xl bg-base text-text-main" placeholder="Ex: 5000" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted uppercase">Téléphone</label>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 p-3 border rounded-xl bg-base text-text-main" placeholder="Numéro Mobile Money" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted uppercase">Moyen de paiement</label>
            <select value={operator} onChange={e => setOperator(Number(e.target.value))} className="w-full mt-1 p-3 border rounded-xl bg-base text-text-main">
              <option value={0}>Universel (Carte, Mobile Money Divers)</option>
              <option value={1}>Orange Money</option>
              <option value={2}>MTN Mobile Money</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-kombi-orange-500 text-white font-bold py-3 rounded-xl flex justify-center mt-4">
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Procéder au paiement"}
          </button>
        </form>
      </div>
    </div>
  );
};


// ==========================================
// --- COMPOSANT : MODALE DE RETRAIT ---
// ==========================================
const WithdrawModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) => {
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [operator, setOperator] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) <= 0) return toast.error("Le montant doit être supérieur à 0.");

    setIsSubmitting(true);
    try {
      await walletService.requestWithdraw({
        amount: Number(amount),
        phoneNumber: phone,
        operator
      });
      toast.success("Demande de retrait soumise. Elle est en cours de validation.");
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.description || "Erreur lors de la demande de retrait.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-surface w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ArrowUpFromLine className="text-blue-500"/> Demander un retrait</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl text-xs text-blue-700 dark:text-blue-300 mb-2">
            Les demandes de retrait sont soumises à la validation d'un administrateur avant l'envoi des fonds.
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted uppercase">Montant à retirer (XAF)</label>
            <input type="number" required min="100" value={amount} onChange={e => setAmount(e.target.value)} className="w-full mt-1 p-3 border rounded-xl bg-base text-text-main" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted uppercase">Téléphone de réception</label>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 p-3 border rounded-xl bg-base text-text-main" />
          </div>
          <div>
            <label className="text-xs font-bold text-text-muted uppercase">Opérateur de réception</label>
            <select value={operator} onChange={e => setOperator(Number(e.target.value))} className="w-full mt-1 p-3 border rounded-xl bg-base text-text-main">
              <option value={1}>Orange Money</option>
              <option value={2}>MTN Mobile Money</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-kombi-dark-500 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl flex justify-center mt-4">
            {isSubmitting ? <Loader2 className="animate-spin" /> : "Soumettre la demande"}
          </button>
        </form>
      </div>
    </div>
  );
};