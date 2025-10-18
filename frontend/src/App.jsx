import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import DragAndDropSection from './components/sections/DragAndDropSection';
import SuggestionsSection from './components/sections/SuggestionsSection';
import DashboardSection from './components/sections/DashboardSection';

/**
 * The main application component.
 * It orchestrates the three main sections and manages the top-level state.
 */
function App() {
  // State to hold the ID of the currently active dataset.
  const [datasetId, setDatasetId] = useState(null);
  // State to hold the list of charts added to the dashboard.
  const [charts, setCharts] = useState([]);

  // Callback for when a file is successfully uploaded.
  const handleUploadSuccess = (newDatasetId) => {
    setDatasetId(newDatasetId);
    // Reset charts when a new file is uploaded.
    setCharts([]);
  };

  // Callback to add a new chart to the dashboard.
  const handleAddChart = (suggestion) => {
    // We use a functional update to prevent duplicates.
    setCharts((prevCharts) => {
      // Check if a chart with the same title already exists.
      const isAlreadyAdded = prevCharts.some(chart => chart.title === suggestion.title);
      if (isAlreadyAdded) {
        return prevCharts;
      }
      // Add the new chart to the list.
      return [...prevCharts, suggestion];
    });
  };

  return (
    <>
      {/* Global component for displaying toast notifications. */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgb(var(--text-default))',
            color: 'rgb(var(--surface))',
          },
        }}
      />

      {/* Main layout container. */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">AI Data Analysis</h1>
          <p className="text-[rgb(var(--text-muted))] mt-2">
            Intelligent suggestions for your .xlsx and .csv files
          </p>
        </header>

        <div className="mt-12 md:mt-16 space-y-20 md:space-y-24">
          {/* Section 1: File Upload */}
          <DragAndDropSection onUploadSuccess={handleUploadSuccess} />

          {/* Separator line for visual clarity. */}
          {datasetId && <hr className="border-t border-[rgb(var(--separator))]" />}

          {/* Section 2: AI Suggestions */}
          <SuggestionsSection datasetId={datasetId} onAddChart={handleAddChart} />
          
          {/* Separator line. */}
          {datasetId && <hr className="border-t border-[rgb(var(--separator))]" />}

          {/* Section 3: Personalized Dashboard */}
          {datasetId && <DashboardSection charts={charts} />}
        </div>
      </main>
    </>
  );
}

export default App;