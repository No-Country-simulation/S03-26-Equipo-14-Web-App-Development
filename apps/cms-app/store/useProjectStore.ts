import { create } from 'zustand'

interface Project {
    id: string,
    title: string,
}

interface ProjectStore {
    projects: Project[]
    selectedProjectId: string
    setProjectId: (name: string) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
    projects: [
        { id: '0', title: 'Todos los proyectos' },
        { id: '1', title: 'Proyecto1' },
        { id: '2', title: 'Proyecto2' },
    ],
    selectedProjectId: '0',
    setProjectId: (name) => set({ selectedProjectId: name }),
}))