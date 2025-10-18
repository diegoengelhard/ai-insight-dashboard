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
          style: {
            background: 'rgb(var(--surface))',
            color: 'rgb(var(--text-default))',
            border: '1px solid rgb(var(--separator))',
          },
        }}
      />

      <main className="min-h-screen bg-[rgb(var(--background))]">
        <div className="container mx-auto px-6 py-10 max-w-7xl">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[rgb(var(--text-default))]">
              AI Insight Dashboard
            </h1>
            <p className="text-[rgb(var(--text-muted))] mt-2 text-lg">
              Intelligent suggestions for your .xlsx and .csv files
            </p>
          </header>

          <div className="space-y-12">
            {/* 1) Drag & Drop */}
            <DragAndDropSection onUploadSuccess={handleUploadSuccess} />

            {/* Separator (más compacta) */}
            {datasetId && <div className="border-t border-[rgb(var(--separator))]" />}

            {/* 2) AI Suggestions (carousel) */}
            <SuggestionsSection datasetId={datasetId} onAddChart={handleAddChart} />

            {/* Separator */}
            {datasetId && <div className="border-t border-[rgb(var(--separator))]" />}

            {/* 3) Dashboard */}
            {datasetId && <DashboardSection datasetId={datasetId} charts={charts} />}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;