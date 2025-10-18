import Skeleton from '../atoms/Skeleton';

/**
 * A wrapper card component for displaying a chart in the dashboard.
 * @param {{
 * title: string,
 * children: React.ReactNode,
 * }} props
 */
const ChartCard = ({ title, children }) => {
  return (
    <div
      style={{ borderRadius: 'var(--radius-input)' }}
      className="bg-[rgb(var(--surface))] p-6 border border-[rgb(var(--separator))] shadow-sm"
    >
      <h3 className="font-bold text-lg text-[rgb(var(--text-default))] mb-4">{title}</h3>
      {/* The chart component will be passed as children. */}
      <div className="h-64">
        {children}
      </div>
    </div>
  );
};

// A skeleton version for the chart card.
ChartCard.Skeleton = function ChartCardSkeleton() {
  return (
     <div
      style={{ borderRadius: 'var(--radius-input)' }}
      className="bg-[rgb(var(--surface))] p-6 border border-[rgb(var(--separator))] shadow-sm"
    >
      <Skeleton className="h-6 w-1/2 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default ChartCard;
