import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import SuggestionCard from '../molecules/SuggestionCard';
import Icon from '../atoms/Icon';

const CarouselButton = ({ onClick, disabled, direction }) => (
  <button
    className="bg-[rgb(var(--surface))]/80 hover:bg-[rgb(var(--surface))]/95 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-3 shadow-md border border-[rgb(var(--separator))] transition-all backdrop-blur-sm"
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === 'prev' ? 'Previous' : 'Next'}
  >
    <Icon
      name={direction === 'prev' ? 'ChevronLeft' : 'ChevronRight'}
      className="text-[rgb(var(--text-default))]"
      size={20}
    />
  </button>
);

const SuggestionsCarousel = ({ suggestions, status, onAddChart }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    onSelect();
  }, [emblaApi]);

  const showNavigation = status === 'success' && suggestions.length > 3;

  return (
    <div className="relative -mx-2">
      <div className="overflow-hidden px-2" ref={emblaRef}>
        <div className="flex gap-4">
          {status === 'loading' &&
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex-[0_0_100%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                <SuggestionCard.Skeleton />
              </div>
            ))}

          {status === 'success' &&
            suggestions.map((suggestion, idx) => (
              <div key={idx} className="flex-[0_0_100%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                <SuggestionCard
                  suggestion={suggestion}
                  onAdd={() => onAddChart(suggestion)}
                />
              </div>
            ))}
        </div>
      </div>

      {showNavigation && (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10">
            <CarouselButton onClick={scrollPrev} disabled={!canScrollPrev} direction="prev" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10">
            <CarouselButton onClick={scrollNext} disabled={!canScrollNext} direction="next" />
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestionsCarousel;