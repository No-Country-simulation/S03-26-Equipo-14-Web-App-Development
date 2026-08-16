'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
} from '@repo/ui';
import { ChevronDown } from '@repo/ui/lib';
import type { Tag } from './types';

export interface TagsSelectProps {
  tags: Tag[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function TagsSelect({ tags, selected, onChange }: TagsSelectProps) {
  const [search, setSearch] = useState('');

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedNames = tags.filter((t) => selected.includes(t.id)).map((t) => t.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className={selectedNames.length === 0 ? 'text-muted-foreground' : 'text-foreground'}>
            {selectedNames.length === 0 ? 'Seleccionar tags...' : selectedNames.join(', ')}
          </span>
          <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
        align="start"
      >
        <div className="p-2">
          <Input
            placeholder="Buscar tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            className="h-8 text-sm"
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Sin resultados</p>
          ) : (
            filtered.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.id}
                checked={selected.includes(tag.id)}
                onCheckedChange={() => toggle(tag.id)}
                onSelect={(e) => e.preventDefault()}
              >
                {tag.name}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
