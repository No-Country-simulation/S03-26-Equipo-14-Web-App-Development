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
import { TestimonialTypeBadge } from './testimonial-type-badge';
import { TestimonialStatusBadge } from './testimonial-status-badge';

interface TestimonialCardProps {
  type: TestimonialType;
  status: TestimonialStatus;
  author: string;
  description: string;
  updatedAt: string;
  onClick: () => void;
}

export function TestimonialCard({
  type,
  status,
  author,
  description,
  updatedAt,
  onClick,
}: TestimonialCardProps) {
  return (
    <Card className="min-h-50 w-full" onClick={onClick}>
      <CardHeader>
        <CardAction className="flex gap-1">
          <TestimonialTypeBadge type={type} />
          <TestimonialStatusBadge status={status} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold truncate">{author}</h2>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <Separator />
      </CardContent>
      <CardFooter className="h-full">
        <p className="text-xs font-normal text-muted-foreground">{updatedAt}</p>
      </CardFooter>
    </Card>
  );
}
