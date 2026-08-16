import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project } from '../types/testimonials';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  currentMemberId: string | null;
  setCurrentMemberId: (memberId: string | null) => void;
  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      currentMemberId: null,
      setCurrentMemberId: (memberId) => set({ currentMemberId: memberId }),
      setCurrentProject: (project) => set({ currentProject: project }),
      setProjects: (projects) => set({ projects }),
    }),
    {
      name: 'project-store',
      partialize: (state) => ({
        currentProject: state.currentProject,
        currentMemberId: state.currentMemberId,
      }),
    },
  ),
);
