import {
  Card,
  CardContent,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components';
import { Plus } from '@repo/ui/lib';

export function OrganizationSection() {
  return (
    <section>
      <h2>Configuración de usuarios</h2>
      <Button>
        <Plus /> Agregar usuario
      </Button>
    </section>
  );
}
