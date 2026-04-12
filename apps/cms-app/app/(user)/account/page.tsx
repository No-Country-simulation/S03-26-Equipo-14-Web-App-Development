'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components';
import { OrganizationSection } from './_components/organization-section';
import { projectColumns } from './_components/table';
import { DataTable } from './_components/table';
import type { Project } from './_components/table';
import { AddProjectsForm } from './_components/add-projects-form';
import { MembersSection } from './_components/members-section';

const projects: Project[] = [
  { id: '1', name: 'Proyecto A', value: 'projectA' },
  { id: '2', name: 'Proyecto B', value: 'projectB' },
  { id: '3', name: 'Proyecto C', value: 'projectC' },
];

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
          <section className="flex flex-col gap-4 h-full">
            <h2 className="text-lg font-semibold truncate">
              Configuracion de proyectos
            </h2>
            <AddProjectsForm />
            <DataTable<Project> columns={projectColumns} data={projects} />
          </section>
        </TabsContent>
        <TabsContent value="organization">
          <OrganizationSection />
        </TabsContent>
      </Tabs>
    </section>
  );
}
