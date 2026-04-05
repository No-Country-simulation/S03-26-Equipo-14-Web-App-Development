import { FiltersBar } from './filtersbar';
import { NoResults } from './no-results';

export function DashboardView() {
  return (
    <>
      <FiltersBar />
      <section className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {/* <div className="bg-blue-500 min-h-[180px]">Card</div>
        <div className="bg-blue-500 min-h-[180px]">Card</div>
        <div className="bg-blue-500 min-h-[180px]">Card</div>
        <div className="bg-blue-500 min-h-[180px]">Card</div>
        <div className="bg-blue-500 min-h-[180px]">Card</div> */}
      </section>
      {/* <NoResults /> */}
    </>
  );
}
