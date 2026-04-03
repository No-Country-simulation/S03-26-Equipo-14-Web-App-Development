import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components';
import { ChevronsUpDown } from '@repo/ui/lib';
import { useProjectStore } from '../../../store/useProjectStore';

export function SidebarProjectSelector() {
  const { projects, selectedProjectId } = useProjectStore();
  const setProjectId = useProjectStore((state) => state.setProjectId);

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip="Seleccionar proyecto"
            className="border-2"
          >
            <ChevronsUpDown className="pr-1" />
            <span className="truncate font-medium">
              {currentProject?.title}
            </span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={selectedProjectId}
            onValueChange={setProjectId}
          >
            {projects.map((item) => (
              <DropdownMenuRadioItem key={item.title} value={item.id}>
                {item.title}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
