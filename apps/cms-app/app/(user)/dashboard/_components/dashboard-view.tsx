import { FiltersBar, Filters } from './filtersbar';
import { TestimonialCard } from './testimonial-card';
import { NoResults } from './no-results';
import { EmptyDashboard } from './empty-dashboard';
import { Testimonial } from '@/types/testimonials';

export function DashboardView({
  testimonials,
  onSelect,
  categories,
  tags,
  filters,
  onFilterChange,
  isListLoading,
}: {
  testimonials: Testimonial[];
  onSelect: (t: Testimonial) => void;
  categories: { id: string; name: string; }[];
  tags: { id: string; name: string; }[];
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  isListLoading?: boolean;
}) {
  const hasActiveFilters = !!(filters.search || filters.type || filters.status || filters.categoryId || filters.tagId);

  return (
    <>
      <FiltersBar categories={categories} tags={tags} filters={filters} onFilterChange={onFilterChange} />
      {isListLoading ? (
        <section
          className={
            filters.layout === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'flex flex-col gap-2'
          }
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="min-h-50 w-full rounded-xl border bg-muted animate-pulse" />
          ))}
        </section>
      ) : testimonials.length === 0 ? (
        hasActiveFilters ? <NoResults /> : <EmptyDashboard />
      ) : (
        <section
          className={
            filters.layout === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'flex flex-col gap-2'
          }
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              type={testimonial.type}
              status={testimonial.status}
              author={testimonial.author}
              description={testimonial.content}
              updated_at={testimonial.updated_at}
              onClick={() => onSelect(testimonial)}
            />
          ))}
        </section>
      )}
    </>
  );
}
