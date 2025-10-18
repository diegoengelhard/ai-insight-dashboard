import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import SuggestionCard from '../molecules/SuggestionCard';
import Icon from '../atoms/Icon';

/**
 * A navigation button for the carousel.
 */
const CarouselButton = ({ onClick, disabled, direction }) => (
  <button
    className="bg-[rgb(var(--surface))] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 shadow-sm border border-[rgb(var(--separator))] transition-colors"
    onClick={onClick}
    disabled={disabled}
  >
    <Icon name={direction === 'prev' ? 'ChevronLeft' : 'ChevronRight'} className="text-[rgb(var(--text-muted))]" />
  </button>
);

/**
 * An organism that displays AI suggestions in a slidable carousel.
 * @param {{
 * suggestions: Array<any>,
 * status: 'idle' | 'loading' | 'success' | 'error',
 * onAddChart: (suggestion: any) => void,
 * }} props
 */
const SuggestionsCarousel = ({ suggestions, status, onAddChart }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Function to scroll to the previous slide.
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  // Function to scroll to the next slide.
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Update button states when the carousel settles or re-initializes.
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect(); // Set initial state
  }, [emblaApi]);

  return (
    <div className="relative">
      {/* Carousel Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {status === 'loading' &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 pl-4">
                <SuggestionCard.Skeleton />
              </div>
            ))}
          
          {status === 'success' &&
            suggestions.map((suggestion, index) => (
              <div key={index} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 pl-4">
                <SuggestionCard suggestion={suggestion} onAdd={() => onAddChart(suggestion)} />
              </div>
            ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      {status === 'success' && suggestions.length > 0 && (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 -left-6">
            <CarouselButton onClick={scrollPrev} disabled={!canScrollPrev} direction="prev" />
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-6">
            <CarouselButton onClick={scrollNext} disabled={!canScrollNext} direction="next" />
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestionsCarousel;
