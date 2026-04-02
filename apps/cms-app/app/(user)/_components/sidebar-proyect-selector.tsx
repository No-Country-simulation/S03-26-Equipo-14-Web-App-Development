import { useState } from 'react';
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

export function SidebarProjectSelector() {
  // Cuando traigamos proyects debemos ordenar por id, siendo 0 la primera opcion para editor y "all" la primera opcion para admin/owner
  const proyects = [
    { id: '0', title: 'Todos los proyectos' },
    { id: '1', title: 'Proyecto1' },
    { id: '2', title: 'Proyecto2' },
  ];
  const [selected, setSelected] = useState<string | undefined>(proyects[0]?.id);
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
              {proyects.find((p) => p.id === selected)?.title ?? 'Error'}
            </span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
            {proyects.map((item) => (
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
