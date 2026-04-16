import type { ComponentProps, Testimonial } from '../../types/common';
import useFetchTestimonials from '../../hooks/fetchTestimonials';
import { useState } from 'react';

import QuoteCard from '../UI/QuoteCard';
import VideoCard from '../UI/VideoCard';
import CaseCard from '../UI/CaseCard';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/index';

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const TestimonialCarrousel = ({
  apiKey,
  length = 2,
  className,
  type,
}: ComponentProps) => {
  const { isLoading, testimonials } = useFetchTestimonials({ apiKey, type });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const data = testimonials?.slice(0, length) ?? [];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) => (prev + newDirection + data.length) % data.length,
    );
  };

  const renderCard = (testimonial: Testimonial) => {
    switch (testimonial.type) {
      case 'case':
        return <CaseCard data={testimonial} />;
      case 'video':
        return <VideoCard data={testimonial} />;
      default:
        return <QuoteCard data={testimonial} />;
    }
  };
  const containerHeight =
    data[currentIndex]?.type === 'video' ? 'min-h-96' : 'min-h-85';
  return (
    <div className={cn('w-full flex flex-col my-10', className)}>
      <div className="flex items-center justify-center px-4">
        {isLoading ? (
          <div className="text-muted-foreground">Cargando testimonios...</div>
        ) : (
          <div className="w-full max-w-3xl flex flex-col gap-8">
            {/* Card animada */}
            <div
              className={`${containerHeight} flex items-center transition-all duration-500`}
            >
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="w-full"
                  layout
                >
                  {data[currentIndex] && renderCard(data[currentIndex])}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => paginate(-1)}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                aria-label="Anterior"
              >
                ←
              </button>

              <div className="flex gap-3">
                {data.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx - currentIndex);
                      setCurrentIndex(idx);
                    }}
                    className={cn(
                      'w-3.5 h-3.5 rounded-full transition-all',
                      idx === currentIndex
                        ? 'bg-primary scale-125'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
                    )}
                    aria-label={`Ir al testimonio ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => paginate(1)}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                aria-label="Siguiente"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCarrousel;
