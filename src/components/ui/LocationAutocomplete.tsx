// src/components/ui/LocationAutocomplete.tsx
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import { mapService } from '../../services/mapService';
import type{ PlaceSuggestion } from '../../types/MapTypes';
import { useAuth } from '../../features/auth/AuthContext';

interface LocationAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string; // La valeur textuelle affichée
  onChangeText: (text: string) => void; // Quand l'utilisateur tape du texte
  onPlaceSelect: (description: string, placeId: string) => void; // Quand un lieu est choisi
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  required?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  label,
  placeholder = "Rechercher un lieu...",
  value,
  onChangeText,
  onPlaceSelect,
  icon: Icon = MapPin, // Icône par défaut si non fournie
  required = false,
}) => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // --- LOGIQUE DE DEBOUNCE POUR L'API ---
  useEffect(() => {
    // Si le texte fait moins de 3 caractères, on ne lance pas de recherche
    if (!value || value.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Si la valeur correspond exactement à une suggestion sélectionnée, on évite de requêter à nouveau
    const exactMatch = suggestions.some(s => s.description === value);
    if (exactMatch) return;

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setIsOpen(true);
      try {
        const results = await mapService.searchPlaces({
          query: value,
          country: user?.country || 237, // Par défaut Cameroun si non connecté
          latitude: 0,
          longitude: 0,
        });
        setSuggestions(results);
      } catch (error) {
        console.error("Erreur autocomplete:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Attendre 300ms d'inactivité avant d'appeler l'API

    return () => clearTimeout(delayDebounceFn);
  }, [value, user?.country]);

  // --- FERMER LE DROPDOWN SI ON CLIQUE AILLEURS ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: PlaceSuggestion) => {
    onPlaceSelect(suggestion.description, suggestion.placeId);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChangeText('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1 w-full relative" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-text-muted ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input de saisie */}
      <div className="flex items-center bg-surface border border-border-main rounded-xl px-3 py-3 focus-within:border-kombi-orange-500 focus-within:ring-1 focus-within:ring-kombi-orange-500 transition-all">
        <Icon size={18} className="text-text-muted mr-2 shrink-0" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChangeText(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => value && value.length >= 3 && setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent outline-none text-text-main placeholder-text-muted text-sm font-medium"
        />

        {/* Indicateur de chargement ou bouton de nettoyage (clear) */}
        {isLoading ? (
          <Loader2 size={16} className="text-kombi-orange-500 animate-spin shrink-0 ml-2" />
        ) : (
          value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-text-muted hover:text-text-main p-0.5 rounded-full hover:bg-base transition-colors shrink-0 ml-2"
            >
              <X size={16} />
            </button>
          )
        )}
      </div>

      {/* Liste déroulante des suggestions (Dropdown) */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-surface border border-border-main rounded-xl shadow-lg overflow-hidden z-[100] max-h-60 overflow-y-auto divide-y divide-border-main transition-all duration-200">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-base text-text-main transition-colors group"
            >
              <MapPin size={16} className="text-text-muted group-hover:text-kombi-orange-500 shrink-0 transition-colors" />
              <span className="text-sm font-medium truncate">{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};