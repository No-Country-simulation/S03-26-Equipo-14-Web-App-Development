import { FiltersBar } from './filtersbar';
import { TestimonialCard } from './testimonial-card';
import { NoResults } from './no-results';
import { Testimonial } from '@/store/useProjectStore';

export function DashboardView({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <>
      <FiltersBar />
      {/* Si tenemos datos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            type={testimonial.type}
            status={testimonial.status}
            author={testimonial.author}
            description={testimonial.content}
            updatedAt={testimonial.updatedAt}
          />
        ))}
      </section>
      {/* Si no hay resultados */}
      {/* <NoResults /> */}
    </>
  );
}
