import ChartCard from '../molecules/ChartCard';
import ChartRenderer from './ChartRenderer';

/**
 * Displays selected charts in a responsive 2-column grid (max ~5 charts).
 * @param {{ datasetId: string, charts: Array<any> }} props
 */
const DashboardGrid = ({ datasetId, charts }) => {
  if (!charts || charts.length === 0) {
    return (
      <div
        style={{ borderRadius: 'var(--radius-input)' }}
        className="bg-[rgb(var(--surface))] p-8 border border-[rgb(var(--separator))] flex items-center justify-center min-h-[200px]"
      >
        <p className="text-[rgb(var(--text-muted))] text-center">
          Your dashboard is empty. Add charts from the suggestions above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {charts.map((suggestion, idx) => (
        <ChartCard key={idx} title={suggestion.title}>
          <div className="flex items-center justify-center h-full">
            <ChartRenderer datasetId={datasetId} suggestion={suggestion} />
          </div>
        </ChartCard>
      ))}
    </div>
  );
};

export default DashboardGrid;
