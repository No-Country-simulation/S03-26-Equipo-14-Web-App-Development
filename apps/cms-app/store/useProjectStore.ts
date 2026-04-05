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
        { id: '0', value:'all' ,title: 'Todos los proyectos' },
        { id: '1', value:'project1' ,title: 'Proyecto 1' },
        { id: '2', value:'project2' ,title: 'Proyecto 2' },
    ],
    selectedProjectId: '0',
    setProjectId: (name) => set({ selectedProjectId: name }),
}))