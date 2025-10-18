import ChartCard from '../molecules/ChartCard';

/**
 * An organism that displays the selected charts in a responsive grid.
 * @param {{
 * charts: Array<any>
 * }} props
 */
const DashboardGrid = ({ charts }) => {
  // If there are no charts, show a placeholder message.
  if (charts.length === 0) {
    return (
      <div
        style={{ borderRadius: 'var(--radius-input)' }}
        className="bg-[rgb(var(--surface))] p-8 border border-[rgb(var(--separator))] flex items-center justify-center min-h-[200px]"
      >
        <p className="text-[rgb(var(--text-muted))] text-center">
          Your dashboard is empty. <br /> Add charts from the suggestions above to get started.
        </p>
      </div>
    );
  }

  // Render the charts in a grid layout.
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((chart, index) => (
        // For now, we render a placeholder ChartCard.
        // Later, this will be a stateful component that fetches and renders the actual chart.
        <ChartCard key={index} title={chart.title}>
          <div className="flex items-center justify-center h-full">
            <p className="text-[rgb(var(--text-muted))]">Chart will be rendered here.</p>
          </div>
        </ChartCard>
      ))}
    </div>
  );
};

export default DashboardGrid;
