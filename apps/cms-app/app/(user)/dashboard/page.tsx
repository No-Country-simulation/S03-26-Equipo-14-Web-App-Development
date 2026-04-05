import { EmptyDashboard } from './_components/empty-dashboard';
import { ErrorMessage } from './_components/error-message';
import { NoProjects } from './_components/no-projects';
import { Loading } from './_components/loading';
import { FiltersBar } from './_components/filtersbar';

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-4 h-full">
      <FiltersBar />
      <EmptyDashboard />
    </section>
  );
  // return <ErrorMessage />;
  // return <NoProjects />;
  // return <Loading/>;
}
