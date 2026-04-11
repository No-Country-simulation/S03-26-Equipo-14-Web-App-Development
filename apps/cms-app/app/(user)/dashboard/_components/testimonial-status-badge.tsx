import { Badge } from '@repo/ui/components';
import { TestimonialStatus } from '@/model/model';

const STATUS_BADGE_CONFIG = {
  draft: { statusType: 'Borrador' },
  pending: { statusType: 'Pendiente' },
  review: { statusType: 'Revisado' },
  published: { statusType: 'Publicado' },
  rejected: { statusType: 'Rechazado' },
} as const;

export function TestimonialStatusBadge({
  status,
}: {
  status: TestimonialStatus;
}) {
  const { statusType } = STATUS_BADGE_CONFIG[status];
  return <Badge variant={status}>{statusType}</Badge>;
}
