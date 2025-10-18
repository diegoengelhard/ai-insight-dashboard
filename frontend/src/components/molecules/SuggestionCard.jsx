import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import Skeleton from '../atoms/Skeleton';

// Maps chart types to specific icons and color themes from our design tokens.
const chartTypeMap = {
  bar: { icon: 'BarChart3', theme: 'sky' },
  line: { icon: 'LineChart', theme: 'indigo' },
  pie: { icon: 'PieChart', theme: 'purple' },
  scatter: { icon: 'ScatterChart', theme: 'sky' },
  default: { icon: 'FileQuestion', theme: 'sky' },
};

/**
 * A card component to display a single AI-generated chart suggestion.
 * @param {{
 * suggestion: { title: string, insight: string, parameters: { chart_type: string } },
 * onAdd: () => void,
 * }} props
 */
const SuggestionCard = ({ suggestion, onAdd }) => {
  // Get the appropriate icon and theme for the chart type.
  const { icon, theme } = chartTypeMap[suggestion.parameters.chart_type] || chartTypeMap.default;

  // Dynamically create class names for background and text colors.
  const bgClass = `bg-[rgb(var(--pastel-${theme}-bg))]`;
  const textClass = `text-[rgb(var(--pastel-${theme}-text))]`;
  const borderClass = `hover:border-[rgb(var(--pastel-${theme}-border))]`;

  return (
    <div
      style={{ borderRadius: 'var(--radius-card)' }}
      className={`bg-[rgb(var(--surface))] p-6 border border-transparent transition-all ${borderClass} shadow-sm flex flex-col`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${bgClass}`}>
          <Icon name={icon} className={textClass} size={24} />
        </div>
        <div>
          <h3 className="font-bold text-[rgb(var(--text-default))]">{suggestion.title}</h3>
          <p className="text-sm text-[rgb(var(--text-muted))] mt-1">{suggestion.insight}</p>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <Button onClick={onAdd} className="w-full">
          Add to Dashboard
        </Button>
      </div>
    </div>
  );
};

// A skeleton version of the card to show during loading states.
SuggestionCard.Skeleton = function SuggestionCardSkeleton() {
  return (
    <div style={{ borderRadius: 'var(--radius-card)' }} className="bg-[rgb(var(--surface))] p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mt-2 rounded-lg" />
    </div>
  );
};


export default SuggestionCard;
