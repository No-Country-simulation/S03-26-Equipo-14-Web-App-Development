import {
  Badge,
  Card,
  CardAction,
  CardHeader,
  CardContent,
  CardFooter,
  Separator,
} from '@repo/ui/components';
import { File, Video, Quote } from '@repo/ui/lib';
import { TestimonialStatus, TestimonialType } from '@/model/model';

const TYPE_BADGE_CONFIG = {
  quote: { labelType: 'Cita', IconType: Quote },
  case: { labelType: 'Caso', IconType: File },
  video: { labelType: 'Video', IconType: Video },
} as const;

const STATUS_BADGE_CONFIG = {
  draft: { statusType: 'Borrador' },
  pending: { statusType: 'Pendiente' },
  reviewed: { statusType: 'Revisado' },
  published: { statusType: 'Publicado' },
  rejected: { statusType: 'Rechazado' },
} as const;

interface TestimonialCardProps {
  type: TestimonialType;
  status: TestimonialStatus;
  author: string;
  description: string;
  updatedAt: string;
}

export function TestimonialCard({
  type,
  status,
  author,
  description,
  updatedAt,
}: TestimonialCardProps) {
  const { labelType, IconType } = TYPE_BADGE_CONFIG[type];
  const { statusType } = STATUS_BADGE_CONFIG[status];

  return (
    <Card className="min-h-50 w-full">
      <CardHeader>
        <CardAction className="flex gap-1">
          <Badge>
            <IconType /> {labelType}
          </Badge>
          <Badge variant={status}>{statusType}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold truncate">{author}</h2>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <Separator />
      </CardContent>
      <CardFooter>
        <p className="text-xs font-normal text-muted-foreground">{updatedAt}</p>
      </CardFooter>
    </Card>
  );
}
