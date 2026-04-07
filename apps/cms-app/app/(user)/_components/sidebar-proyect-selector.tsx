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
import { useState } from 'react';

export function SidebarProjectSelector() {
  const [open, setOpen] = useState(false);

  const { projects, selectedProjectId } = useProjectStore();
  const setProjectId = useProjectStore((state) => state.setProjectId);

  const currentProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <SidebarMenuButton
          role="combobox"
          aria-expanded={open}
          tooltip="Seleccionar proyecto"
          className="border-2"
        >
          <ChevronDown className="h-3! w-3! shrink-0 opacity-50" />
          <span className="truncate font-medium">
            {currentProject?.title ?? 'Seleccionar proyecto'}
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
            {projects.map((item) => {
              const isSelected = item.id === selectedProjectId;
              return (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => {
                    setProjectId(item.id);
                    setOpen(false);
                  }}
                  className="data-selected:bg-popover data-[selected=true]:bg-muted"
                >
                  <span className="truncate">{item.title}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
