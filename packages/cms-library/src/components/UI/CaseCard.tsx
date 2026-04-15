import type { Testimonial } from '../../types/common';
import { cn } from '../../lib/index';

interface CaseCardProps {
  data: Testimonial;
  className?: string;
}

const CaseCard = ({ data, className }: CaseCardProps) => {
  return (
    <div
      className={cn(
        'border border-border bg-card text-card-foreground rounded-2xl p-8 shadow-sm',
        'flex flex-col min-h-60',
        className,
      )}
    >
      <div className="flex-1 text-lg leading-relaxed text-foreground">
        “{data.content}”
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted shrink-0 overflow-hidden border border-border">
          {data.author_photo ? (
            <img
              src={data.author_photo}
              alt={data.author}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10" />
          )}
        </div>

        <div>
          <p className="font-semibold text-foreground">{data.author}</p>
          <p className="text-sm text-muted-foreground">{data.author_role}</p>
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
