import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@repo/ui/components';
import { Check } from '@repo/ui/lib';
import { cn } from '@repo/ui/lib/utils';

export type Option = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = 'Seleccionar...',
}: MultiSelectProps) {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value.length > 0 ? `${value.length} seleccionados` : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="min-w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandList>
            <CommandEmpty>No encontrado</CommandEmpty>

            <CommandGroup>
              {options.map((opt) => {
                const isSelected = value.includes(opt.value);

                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={() => toggle(opt.value)}
                  >
                    {opt.label}

                    <Check
                      className={cn(
                        'ml-auto',
                        isSelected ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
