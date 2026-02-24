import React, { useEffect, useState } from 'react';
import { useAdminSuggestions } from '../../../contexts/Admin/AdminSuggestionsContext'; // Ajustez le chemin selon votre structure
import { Trash2, Eye, RefreshCw } from 'lucide-react';

const Suggestions = () => {
  const { 
    suggestions, 
    loading, 
    fetchAllSuggestionsAsAdmin, 
    deleteSuggestionAsAdmin 
  } = useAdminSuggestions();

  // État local pour gérer la pagination (si votre contexte le permet)
  const [currentPage, setCurrentPage] = useState(0);

  // Chargement initial et au changement de page
  useEffect(() => {
    fetchAllSuggestionsAsAdmin(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Monsieur, souhaitez-vous vraiment supprimer la suggestion : "${title}" ?`)) {
      await deleteSuggestionAsAdmin(id);
      // Optionnel : Recharger la liste après suppression
      // fetchAllSuggestionsAsAdmin(currentPage);
    }
  };

  const handleRefresh = () => {
    fetchAllSuggestionsAsAdmin(currentPage);
  };

  // Affichage pendant le chargement initial
  if (loading && suggestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
        <RefreshCw className="animate-spin mr-3" size={24} />
        <span className="font-medium">Chargement des suggestions, monsieur...</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto transition-colors duration-200">
      
      {/* --- EN-TÊTE --- */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Boîte à Idées & Suggestions</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Consultez et gérez les retours et demandes d'itinéraires des utilisateurs.
            </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="p-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
          title="Actualiser la liste"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* --- TABLEAU DES SUGGESTIONS --- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                <th className="p-4 w-20">ID</th>
                <th className="p-4">Titre / Trajet</th>
                <th className="p-4">Utilisateur</th>
                <th className="p-4 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group">
                    
                    {/* ID */}
                    <td className="p-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                      #{item.id}
                    </td>
                    
                    {/* Titre */}
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title || <span className="italic text-gray-400 dark:text-gray-500">Sans titre</span>}
                      </div>
                      {/* Si vous avez une description dans l'objet item, vous pouvez l'afficher ici */}
                      {item.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </td>
                    
                    {/* Utilisateur */}
                    <td className="p-4">
                        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {item.userEmail || <span className="italic text-gray-400">Anonyme</span>}
                        </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {/* Implémenter l'ouverture d'une modale ou navigation */}}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Voir les détails complets"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Supprimer cette suggestion"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-transparent">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl block mb-2">💡</span>
                        <p>Aucune suggestion n'est disponible pour le moment, monsieur.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">
             Page courante : <span className="font-semibold text-gray-900 dark:text-white">{currentPage + 1}</span>
          </p>
          <div className="flex gap-2">
            <button 
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0 || loading}
                className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Précédent
            </button>
            <button 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={suggestions.length === 0 || loading} // Désactive si la page actuelle est vide (fin de liste)
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
                Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;