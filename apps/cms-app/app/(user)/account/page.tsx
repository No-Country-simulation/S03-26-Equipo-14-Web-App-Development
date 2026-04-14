'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components';
import { OrganizationSection } from './_components/organization-section';
import { MembersSection } from './_components/members-section';
import { ProjectsSection } from './_components/projects-section';
import { ProfileForm } from './_components/profile-form';

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
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold">Mi perfil</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Gestiona tu información personal
              </p>
            </div>
            <ProfileForm />
          </div>
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
