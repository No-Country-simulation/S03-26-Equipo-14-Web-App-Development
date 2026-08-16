'use client';

import {
  Button,
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components';
import { Search, Plus, LayoutGrid, List } from '@repo/ui/lib';
import { useRouter } from 'next/navigation';

export interface Filters {
  search: string;
  type: string;
  status: string;
  sorted: string;
  categoryId: string;
  tagId: string;
  layout: string;
}

const TYPE_OPTIONS = [
  { label: 'Cita', value: 'quote' },
  { label: 'Caso', value: 'case' },
  { label: 'Video', value: 'video' },
];

const STATUS_OPTIONS = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Pendiente', value: 'pending' },
  { label: 'Revisado', value: 'review' },
  { label: 'Publicado', value: 'published' },
  { label: 'Rechazado', value: 'rejected' },
];

export function FiltersBar({
  categories,
  tags,
  filters,
  onFilterChange,
}: {
  categories: { id: string; name: string; }[];
  tags: { id: string; name: string; }[];
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between gap-4">
        <InputGroup className="w-full">
          <InputGroupInput
            placeholder="Buscar testimonios..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <div className="flex flex-row gap-4">
          <Tabs value={filters.layout} onValueChange={(v) => onFilterChange('layout', v)}>
            <TabsList>
              <TabsTrigger value="grid">
                <LayoutGrid />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => router.push('/testimonials/new')}>
            <Plus /> Agregar testimonio
          </Button>
        </div>
      </div>
      <div className="flex gap-4 items-end justify-between">
        <FieldSet className="w-full">
          <FieldGroup className="grid grid-cols-4 gap-4">
            <Field>
              <FieldLabel>Tipo</FieldLabel>
              <Select
                value={filters.type || 'all'}
                onValueChange={(v) => onFilterChange('type', v === 'all' ? '' : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos</SelectItem>
                    {TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Estado</FieldLabel>
              <Select
                value={filters.status || 'all'}
                onValueChange={(v) => onFilterChange('status', v === 'all' ? '' : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos</SelectItem>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Categoría</FieldLabel>
              <Select
                value={filters.categoryId || 'all'}
                onValueChange={(v) => onFilterChange('categoryId', v === 'all' ? '' : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Tag</FieldLabel>
              <Select
                value={filters.tagId || 'all'}
                onValueChange={(v) => onFilterChange('tagId', v === 'all' ? '' : v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos</SelectItem>
                    {tags.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>

        <Tabs value={filters.sorted} onValueChange={(v) => onFilterChange('sorted', v)}>
          <TabsList>
            <TabsTrigger value="newest">Recientes</TabsTrigger>
            <TabsTrigger value="oldest">Antiguos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
