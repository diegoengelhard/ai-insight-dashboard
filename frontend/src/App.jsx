import { useCallback, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import DragAndDropSection from './components/sections/DragAndDropSection';
import SuggestionsSection from './components/sections/SuggestionsSection';
import DashboardSection from './components/sections/DashboardSection';

function App() {
  const [datasetId, setDatasetId] = useState(null);
  const [charts, setCharts] = useState([]);

  const handleUploadSuccess = useCallback((newDatasetId) => {
    setDatasetId(newDatasetId);
    setCharts([]);
  }, []);

  const handleAddChart = useCallback((suggestion) => {
    setCharts((prev) => {
      const exists = prev.some((c) => c.title === suggestion.title);
      return exists ? prev : [...prev, suggestion];
    });
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: 'rgb(var(--text-default))', color: 'rgb(var(--surface))' },
        }}
      />

      <main className="container mx-auto px-4 py-12 md:py-16">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Análisis de Datos con IA</h1>
          <p className="text-[rgb(var(--text-muted))] mt-2">
            Sugerencias inteligentes para tus archivos .xlsx y .csv
          </p>
        </header>

        <div className="mt-12 md:mt-16 space-y-20 md:space-y-24">
          {/* 1) Drag & Drop */}
          <DragAndDropSection onUploadSuccess={handleUploadSuccess} />
          {datasetId && <hr className="border-t border-[rgb(var(--separator))]" />}

          {/* 2) AI Suggestions (carousel) */}
          <SuggestionsSection datasetId={datasetId} onAddChart={handleAddChart} />
          {datasetId && <hr className="border-t border-[rgb(var(--separator))]" />}

          {/* 3) Dashboard */}
          {datasetId && <DashboardSection datasetId={datasetId} charts={charts} />}
        </div>
      </main>
    </>
  );
}

export default App;