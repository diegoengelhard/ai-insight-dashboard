import { useEffect, useRef } from 'react';
import { useSuggestions } from '../../hooks/useSuggestions';
import SuggestionsCarousel from '../../components/organisms/SuggestionsCarousel';

const SuggestionsSection = ({ datasetId, onAddChart }) => {
  const { status, suggestions, error, fetchSuggestions } = useSuggestions();
  const lastRequestedIdRef = useRef(null);

  // Fetch once per datasetId (evita doble llamada en StrictMode)
  useEffect(() => {
    if (datasetId && lastRequestedIdRef.current !== datasetId) {
      lastRequestedIdRef.current = datasetId;
      fetchSuggestions(datasetId);
    }
  }, [datasetId, fetchSuggestions]);

  return (
    <section aria-labelledby="suggestions-heading">
      <h2 id="suggestions-heading" className="text-2xl font-bold mb-6">
        Sugerencias de Gráficos Basadas en IA
      </h2>

      {!datasetId && (
        <p className="text-[rgb(var(--text-muted))]">
          Sube un archivo para recibir sugerencias de gráficos impulsadas por IA.
        </p>
      )}

      {datasetId && (
        <SuggestionsCarousel
          suggestions={suggestions}
          status={status}
          onAddChart={onAddChart}
        />
      )}

      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
    </section>
  );
};

export default SuggestionsSection;