import Button from '../atoms/Button';
import Skeleton from '../atoms/Skeleton';

const SuggestionCard = ({ suggestion, onAdd }) => {
  return (
    <div
      style={{ borderRadius: 'var(--radius-card)' }}
      className="bg-[rgb(var(--surface))] p-8 border border-[rgb(var(--separator))] shadow-sm hover:shadow-md transition-all flex flex-col h-full min-h-[280px]"
    >
      {/* Contenido */}
      <div>
        <h3 className="font-bold text-lg text-[rgb(var(--text-default))] mb-3">
          {suggestion.title}
        </h3>
        <p className="text-sm text-[rgb(var(--text-muted))] leading-relaxed">
          {suggestion.insight}
        </p>
      </div>

      {/* Botón al fondo */}
      <div className="mt-auto pt-6">
        <Button onClick={onAdd} className="w-full">
          Add to Dashboard
        </Button>
      </div>
    </div>
  );
};

SuggestionCard.Skeleton = function SuggestionCardSkeleton() {
  return (
    <div
      style={{ borderRadius: 'var(--radius-card)' }}
      className="bg-[rgb(var(--surface))] p-8 border border-[rgb(var(--separator))] shadow-sm flex flex-col gap-4 h-full min-h-[280px]"
    >
      <div className="space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-11 w-full mt-auto rounded-lg" />
    </div>
  );
};

export default SuggestionCard;