'use client';

import { DataTable, getProjectColumns } from './table';
import type { Project } from './table';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/shared/lib/apiClient';
import { useState, useMemo } from 'react';

import { AddProjectDialog } from './add-project-dialog';
import { ManageProjectModal } from './manage-project-modal';
import { ProjectSheet } from './project-sheet';

export function ProjectsSection() {
  const [open, setOpen] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Project[]; }>('/projects');
      return res.data.data;
    },
  });

  const handleManageProject = (project: Project) => {
    setSelected(project);
    setOpen(true);
  };

  const handleViewMembers = (project: Project) => {
    setSelected(project);
    setOpenSheet(true);
  };

  const columns = useMemo(
    () => getProjectColumns(handleManageProject, handleViewMembers),
    [],
  );

  return (
    <>
      <ManageProjectModal
        open={open}
        onOpenChange={setOpen}
        project={selected}
      />
      <section className="flex flex-col gap-4 h-full">
        <h2 className="text-lg font-semibold truncate">
          Configuracion de proyectos
        </h2>
        <div className="flex justify-end">
          <AddProjectDialog />
        </div>
        <DataTable<Project> columns={columns} data={projects} />
      </section>
      <ProjectSheet
        open={openSheet}
        onOpenChange={setOpenSheet}
        project={selected}
      />
    </>
  );
}
