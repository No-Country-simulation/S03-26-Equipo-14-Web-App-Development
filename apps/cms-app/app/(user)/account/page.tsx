import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components';
import { UsersSection } from './_components/usersSection';
import { ProjectsSection } from './_components/projectsSection';
import { OrganizationSection } from './_components/organizationSection';

export default function AccountPage() {
  return (
    <section>
      <Tabs defaultValue="profile">
        <TabsList variant="line">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="organization">Organización</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          OPCIONES PARA CAMBIAR INFO DEL PERFIL PERSONAL
        </TabsContent>
        <TabsContent value="users">
          <UsersSection />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsSection />
        </TabsContent>
        <TabsContent value="organization">
          <OrganizationSection />
        </TabsContent>
      </Tabs>
    </section>
  );
}
