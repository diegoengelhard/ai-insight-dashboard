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
        AI Suggestions for Your Data
      </h2>

      {!datasetId && (
        <p className="text-[rgb(var(--text-muted))]">
          Upload a dataset to see AI-generated chart suggestions.
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