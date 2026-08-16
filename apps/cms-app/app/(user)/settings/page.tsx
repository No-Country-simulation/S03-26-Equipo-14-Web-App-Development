import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components';
import { MembersView } from '../members/_components/members-view';
import { ProjectsView } from '../members/_components/projects-view';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Configuraciones</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Administra tu organización y sus miembros
        </p>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <MembersView />
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <ProjectsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
