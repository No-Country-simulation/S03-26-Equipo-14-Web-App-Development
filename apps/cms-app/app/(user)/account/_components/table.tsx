'use client';

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/components';
import { useState, useMemo, useEffect } from 'react';

export type Member = {
  id: string;
  userId: string;
  avatar: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Owner';
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  value: string;
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '';

  if (parts.length === 1) {
    return parts[0]!.charAt(0).toUpperCase();
  }

  const first = parts[0]!;
  const last = parts[parts.length - 1]!;

  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}

export const getUserColumns = (
  onManage: (user: Member) => void,
): ColumnDef<Member>[] => [
  {
    accessorKey: 'name',
    header: 'Usuario',
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    filterFn: 'equalsString',
    cell: ({ row }) => {
      const user = row.original;
      const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
        Owner: 'default',
        Admin: 'secondary',
        Editor: 'outline',
      };
      return (
        <Badge variant={variants[user.role] ?? 'outline'}>{user.role}</Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de registro',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const user = row.original;

      if (user.role !== 'Owner') {
        return (
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={() => onManage(user)}>
              Gestionar
            </Button>
          </div>
        );
      }
    },
  },
];

export const projectColumns: ColumnDef<Project>[] = [
  {
    accessorKey: 'name',
    header: 'Proyecto',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Button size="sm">Gestionar</Button>
      </div>
    ),
  },
];

type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  enableRoleFilter?: boolean;
};

export function DataTable<TData>({
  columns,
  data,
  enableRoleFilter = false,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  const columnFilters = useMemo(() => {
    if (!enableRoleFilter) return [];
    return roleFilter ? [{ id: 'role', value: roleFilter }] : [];
  }, [roleFilter, enableRoleFilter]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setGlobalFilter(search);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="space-y-4">
      {/* 🔍 BUSCADOR + FILTRO */}
      <div className="flex gap-4">
        <Input
          placeholder="Buscar usuario..."
          value={globalFilter}
          onChange={(e) => setSearch(e.target.value)}
        />
        {enableRoleFilter && (
          <Select
            onValueChange={(value) =>
              setRoleFilter(value === 'all' ? undefined : value)
            }
            value={roleFilter ?? 'all'}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 📋 TABLA */}
      <table className="w-full border">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="text-left p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
