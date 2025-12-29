import React, { useEffect } from 'react';
import { useAdminSuggestions } from '../../../contexts/Admin/AdminSuggestionsContext'; // Ajustez le chemin selon votre structure
import { Trash2, Eye, RefreshCw } from 'lucide-react'; // Optionnel : pour des icônes élégantes

const Suggestions = () => {
  const { 
    suggestions, 
    loading, 
    fetchAllSuggestionsAsAdmin, 
    deleteSuggestionAsAdmin 
  } = useAdminSuggestions();

  // Chargement initial (page 0)
  useEffect(() => {
    fetchAllSuggestionsAsAdmin(0);
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Monsieur, souhaitez-vous vraiment supprimer la suggestion : "${title}" ?`)) {
      await deleteSuggestionAsAdmin(id);
    }
  };

  if (loading && suggestions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin mr-2" />
        <span>Chargement des suggestions, monsieur...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Suggestions</h1>
        <button 
          onClick={() => fetchAllSuggestionsAsAdmin(0)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Actualiser"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 font-semibold text-gray-600">ID</th>
              <th className="p-4 font-semibold text-gray-600">Titre / Trajet</th>
              <th className="p-4 font-semibold text-gray-600">Utilisateur</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-500">#{item.id}</td>
                  <td className="p-4 text-gray-800 font-medium">
                    {item.title || "Sans titre"}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {item.userEmail || "Anonyme"}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => {/* Naviguer vers les détails */}}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Voir les détails"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id, item.title)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  Aucune suggestion n'est disponible pour le moment, monsieur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination simplifiée */}
      <div className="mt-6 flex justify-end gap-2">
        <button className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Précédent</button>
        <button className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700">Suivant</button>
      </div>
    </div>
  );
};

export default Suggestions;
