import { Badge } from '@repo/ui/components';
import { File, Video, Quote } from '@repo/ui/lib';
import { TestimonialType } from '@/model/model';

const TYPE_BADGE_CONFIG = {
  quote: { labelType: 'Cita', IconType: Quote },
  case: { labelType: 'Caso', IconType: File },
  video: { labelType: 'Video', IconType: Video },
} as const;

export function TestimonialTypeBadge({ type }: { type: TestimonialType }) {
  const { labelType, IconType } = TYPE_BADGE_CONFIG[type];
  return (
    <Badge>
      <IconType /> {labelType}
    </Badge>
  );
}
