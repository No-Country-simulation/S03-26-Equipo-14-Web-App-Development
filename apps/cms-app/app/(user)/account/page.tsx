'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components';
import { OrganizationSection } from './_components/organization-section';
import { MembersSection } from './_components/members-section';
import { ProjectsSection } from './_components/projects-section';

export default function AccountPage() {
  return (
    <section>
      <Tabs defaultValue="profile">
        <TabsList variant="line">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="organization">Organización</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          OPCIONES PARA CAMBIAR INFO DEL PERFIL PERSONAL
        </TabsContent>
        <TabsContent value="members">
          <MembersSection />
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
