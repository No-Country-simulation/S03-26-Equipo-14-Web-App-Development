'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import apiClient from '@/shared/lib/apiClient';
import {
  Badge,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components';
import { ChangeRoleDialog } from './change-role-dialog';
import { AddMemberDialog } from './add-member-dialog';
import { RemoveMemberDialog } from './remove-member-dialog';
import { ProjectsView } from './projects-view';

type OrgMember = {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'Owner' | 'Admin' | 'Editor';
  created_at: string;
};

type OrgWithMembers = {
  id: string;
  name: string;
  organizationMembers: OrgMember[];
};

function RoleBadge({ role }: { role: string; }) {
  const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
    Owner: 'default',
    Admin: 'secondary',
    Editor: 'outline',
  };
  return <Badge variant={variants[role] ?? 'outline'}>{role}</Badge>;
}

export function MembersView() {
  const { data: session } = useSession();
  const orgId = session?.user?.organizationId;
  const currentUserId = session?.user?.id;
  const isOwner = session?.user?.role === 'Owner';

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['org-members', orgId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: OrgWithMembers; }>(
        `/organization/membersList/${orgId}`,
      );
      return res.data.data;
    },
    enabled: !!orgId,
  });

  const members = data?.organizationMembers ?? [];

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['org-members', orgId] });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Miembros de la organización</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestiona los miembros y proyectos de tu organización
        </p>
      </div>

      {isOwner && (
        <div className="flex justify-end">
          <AddMemberDialog onSuccess={handleRefresh} />
        </div>
      )}

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Miembros</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID de usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Miembro desde</TableHead>
                  {isOwner && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-mono text-xs">
                      {member.user_id}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={member.role} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    {isOwner && (
                      <TableCell className="text-right">
                        {member.user_id !== currentUserId &&
                          member.role !== 'Owner' && (
                            <div className="flex gap-2 justify-end">
                              <ChangeRoleDialog
                                userId={member.user_id}
                                currentRole={member.role as 'Admin' | 'Editor'}
                                onSuccess={handleRefresh}
                              />
                              <RemoveMemberDialog
                                memberId={member.id}
                                userId={member.user_id}
                                onSuccess={handleRefresh}
                              />
                            </div>
                          )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <ProjectsView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
