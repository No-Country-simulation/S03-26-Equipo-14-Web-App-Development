'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components';
import { MembersSection } from './_components/members-section';
import { ProjectsSection } from './_components/projects-section';
import { OrganizationSection } from './_components/organization-section';

export default function SettingsPage() {
  return (
    <section>
      <Tabs defaultValue="members">
        <TabsList variant="line">
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="organization">Organización</TabsTrigger>
        </TabsList>

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
