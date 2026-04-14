import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Skeleton,
} from '@repo/ui/components';
import { Project } from './table';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import { getInitials } from './table';
// import { MultiSelect } from '../../_components/multiselect';

type ProjectMember = {
  id: string;
  organization_member_id: string;
  project_id: string;
  user_id: string;
  created_at: string;
  organization_member: { user: { name: string } };
};

export function ProjectSheet({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}) {
  const {
    data: projectMembers = [],
    isLoading: loadingMembers,
    isError: membersError,
  } = useQuery({
    queryKey: ['project-members', project?.id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: ProjectMember[] }>(
        `/projects/projectMembers/${project!.id}`,
      );
      return res.data.data;
    },
    enabled: !!project?.id,
    retry: false,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Miembros de {project?.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {loadingMembers ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : membersError || projectMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay miembros asignados a este proyecto.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Asignado desde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectMembers.map((pm) => (
                  <TableRow key={pm.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage alt={pm.organization_member.user.name} />
                          <AvatarFallback>
                            {getInitials(pm.organization_member.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{pm.organization_member.user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(pm.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {/* <SheetHeader>
          <SheetTitle>Agregar miembro</SheetTitle>
          <div>MultiSelect</div>
          <Button>Agregar miembro</Button>
        </SheetHeader> */}
      </SheetContent>
    </Sheet>
  );
}
