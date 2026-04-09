'use client';

import {
  SidebarMenuButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@repo/ui/components';
import { ChevronDown, Check } from '@repo/ui/lib';
import { useProjectStore } from '../../../store/useProjectStore';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import { useSession } from 'next-auth/react';

export function SidebarProjectSelector() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const { currentProject, setCurrentProject, setProjects, projects, setCurrentMemberId } = useProjectStore();
  const { data: projectsData, isError, isLoading } = useQuery({
    queryKey: ['projects', session?.user?.id],
    queryFn: async () => {
      const response = await apiClient('/projects');
      return response.data.data;
    },
    enabled: !!session?.user?.id
  });
  const { data: currentMemberIdData } = useQuery({
    queryKey: ['currentMember', currentProject?.id, session?.user?.id],
    queryFn: async () => {
      const response = await apiClient(`/projects/projectMembers/${currentProject?.id}`);
      return response.data.data;
    },
    enabled: !!currentProject?.id && !!session?.user?.id,
    select: (data) => data?.find((member: { user_id: string; }) => member.user_id === session?.user?.id)?.id ?? null,
  });

  useEffect(() => {
    setProjects(projectsData ?? []);
  }, [projectsData, setProjects]);

  useEffect(() => {
    if (currentMemberIdData !== undefined) {
      setCurrentMemberId(currentMemberIdData);
    }
  }, [currentMemberIdData, setCurrentMemberId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isLoading || isError}>
        <SidebarMenuButton
          role="combobox"
          aria-expanded={open}
          tooltip="Seleccionar proyecto"
          className="border-2"
        >
          <ChevronDown className="h-3! w-3! shrink-0 opacity-50" />
          <span className="truncate font-medium">
            {currentProject?.name ?? 'Todos los proyectos'}
          </span>
        </SidebarMenuButton>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Buscar proyecto..." />

          <CommandEmpty>No encontrado</CommandEmpty>

          <CommandGroup>
            <CommandItem
              key="all-projects"
              value=""
              onSelect={() => {
                setCurrentProject(null);
                setOpen(false);
              }}
              className="data-selected:bg-popover data-[selected=true]:bg-muted"
            >
              <span className="truncate">Todos los proyectos</span>
              {currentProject === null && <Check className="h-4 w-4" />}
            </CommandItem>
            {projects.map((item) => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => {
                  setCurrentProject(item);
                  setOpen(false);
                }}
                className="data-selected:bg-popover data-[selected=true]:bg-muted"
              >
                <span className="truncate">{item.name}</span>
                {item.id === currentProject?.id && <Check className="h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
