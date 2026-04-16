import { useState } from 'react';
import { cn } from '../../lib';
import type { Testimonial } from '../../types/common';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  onChange?: (v: number) => void;
}
const STAR =
  '10,2 12.4,7.5 18.5,8 14,12.2 15.5,18 10,14.8 4.5,18 6,12.2 1.5,8 7.6,7.5';

export function StarRating({
  value,
  max = 5,
  size = 20,
  onChange,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? value;

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < display;
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            style={{ cursor: onChange ? 'pointer' : 'default' }}
            onMouseEnter={() => onChange && setHovered(i + 1)}
            onMouseLeave={() => onChange && setHovered(null)}
            onClick={() => onChange?.(i + 1)}
          >
            <polygon
              points={STAR}
              fill={filled ? '#EF9F27' : 'none'}
              stroke={filled ? '#EF9F27' : '#B4B2A9'}
              strokeWidth="0.5"
            />
          </svg>
        );
      })}
    </div>
  );
}

interface QuoteCardProps {
  data: Testimonial;
  className?: string;
}

const QuoteCard = ({ data, className }: QuoteCardProps) => {
  return (
    <div
      className={cn(
        'border border-border bg-card text-card-foreground rounded-2xl p-8 shadow-sm',
        'flex flex-col min-h-60',
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-5">
        <div className="flex-1 text-lg leading-relaxed">{data.content}</div>
        <div className="">
          {data.rating && <StarRating value={Number(data.rating)} />}
        </div>
        <div className="text-xl font-bold">{data.author}</div>
      </div>
    </div>
  );
};

export default QuoteCard;
