import { EmptyDashboard } from './_components/empty-dashboard';
import { ErrorMessage } from './_components/error-message';
import { NoProjects } from './_components/no-projects';
import { Loading } from './_components/loading';

export default function DashboardPage() {
  return <EmptyDashboard />;
  // return <ErrorMessage />;
  // return <NoProjects />;
  // return <Loading/>;
}
