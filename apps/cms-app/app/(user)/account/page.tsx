'use client';

import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components';
import { AddUsersForm } from './_components/addUsersForm';
import { OrganizationSection } from './_components/organizationSection';
import { userColumns, projectColumns } from './_components/table';
import { DataTable } from './_components/table';
import type { User, Project } from './_components/table';

const users: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'María López',
    email: 'maria.lopez@email.com',
    role: 'editor',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Carlos García',
    email: 'carlos.garcia@email.com',
    role: 'owner',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: 'Ana Torres',
    email: 'ana.torres@email.com',
    role: 'editor',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: 'Luis Fernández',
    email: 'luis.fernandez@email.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    name: 'Sofía Ramírez',
    email: 'sofia.ramirez@email.com',
    role: 'editor',
    avatar: 'https://i.pravatar.cc/150?img=6',
  },
  {
    id: '7',
    name: 'Pedro Castillo',
    email: 'pedro.castillo@email.com',
    role: 'owner',
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
  {
    id: '8',
    name: 'Lucía Herrera',
    email: 'lucia.herrera@email.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=8',
  },
];

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
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="organization">Organización</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          OPCIONES PARA CAMBIAR INFO DEL PERFIL PERSONAL
        </TabsContent>
        <TabsContent value="users">
          <section className="flex flex-col gap-4 h-full">
            <h2 className="text-lg font-semibold truncate">
              Configuracion de usuarios
            </h2>
            <AddUsersForm />
            <DataTable<User>
              columns={userColumns}
              data={users}
              enableRoleFilter
            />
          </section>
        </TabsContent>
        <TabsContent value="projects">
          <DataTable<Project> columns={projectColumns} data={projects} />
        </TabsContent>
        <TabsContent value="organization">
          <OrganizationSection />
        </TabsContent>
      </Tabs>
    </section>
  );
}
