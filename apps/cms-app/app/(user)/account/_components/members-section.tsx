'use client';

import { Skeleton } from '@repo/ui/components';
import { getUserColumns, DataTable } from './table';
import type { Member } from './table';
import { AddMemberDialog } from './add-member-dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import apiClient from '@/shared/lib/apiClient';
import { ManageUserModal } from './manage-user-modal';
import { useState, useMemo } from 'react';

type OrgMember = {
  id: string;
  user_id: string;
  organization_id: string;
  role: 'Owner' | 'Admin' | 'Editor';
  created_at: string;
  user: { email: string; name: string };
};

type OrgWithMembers = {
  id: string;
  name: string;
  organizationMembers: OrgMember[];
};

export function MembersSection() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const orgId = session?.user?.organizationId;

  const { data, isLoading } = useQuery({
    queryKey: ['org-members', orgId],
    queryFn: async () => {
      const res = await apiClient.get<{ data: OrgWithMembers }>(
        `/organization/membersList/${orgId}`,
      );
      return res.data.data;
    },
    enabled: !!orgId,
  });

  const members = data?.organizationMembers ?? [];
  const membersCleanData: Member[] = members.map((m) => {
    return {
      id: m.id,
      userId: m.user_id,
      avatar: m.user.name,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      createdAt: new Date(m.created_at).toLocaleDateString('es-ES'),
    };
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['org-members', orgId] });
  };

  const handleManageUser = (user: Member) => {
    setSelected(user);
    setOpen(true);
  };

  const columns = useMemo(() => getUserColumns(handleManageUser), []);

  return (
    <>
      <ManageUserModal
        open={open}
        onOpenChange={setOpen}
        member={selected}
        onSuccess={handleRefresh}
        // onDelete={handleDelete}
        // onPublish={handlePublish}
      />
      <section className="flex flex-col gap-4 h-full">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold truncate">
              Configuración de usuarios
            </h2>
            <div className="flex justify-end">
              <AddMemberDialog onSuccess={handleRefresh} />
            </div>
            <DataTable<Member>
              columns={columns}
              data={membersCleanData}
              enableRoleFilter
            />
          </>
        )}
      </section>
    </>
  );
}
