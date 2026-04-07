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
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const filtersPlaceholder = 'Seleccione...';
const filters = [
  {
    label: 'Tipo',
    items: ['Cita', 'Caso', 'Video'],
  },
  {
    label: 'Estado',
    items: ['Borrador', 'Pendiente', 'Revisado', 'Publicado', 'Rechazado'],
  },
  {
    label: 'Origen',
    items: ['Visitante', 'Editor'],
  },
  {
    label: 'Categoría',
    items: ['Producto', 'Evento', 'Cliente', 'Industria'],
  },
  {
    label: 'Tag',
    items: ['recomendado', 'expansión', 'crecimiento', 'impulso', 'éxito'],
  },
];

export function FiltersBar() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between gap-4">
        <InputGroup className="w-full">
          <InputGroupInput placeholder="Buscar testimonios..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          {/* <InputGroupAddon align="inline-end">12 results</InputGroupAddon> */}
        </InputGroup>
        <div className="flex flex-row gap-4">
          <Tabs defaultValue="grid">
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
          <FieldGroup className="grid grid-cols-5 gap-4">
            {filters.map((f) => (
              <Field className="" key={f.label.toLowerCase()}>
                <FieldLabel htmlFor={f.label.toLowerCase()}>
                  {f.label}
                </FieldLabel>
                <Select>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder={filtersPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {f.items.map((item) => (
                        <SelectItem
                          key={item.toLowerCase()}
                          value={item.toLowerCase()}
                        >
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>

        <Tabs defaultValue="newest">
          <TabsList>
            <TabsTrigger value="newest">Recientes</TabsTrigger>
            <TabsTrigger value="oldest">Antiguos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
