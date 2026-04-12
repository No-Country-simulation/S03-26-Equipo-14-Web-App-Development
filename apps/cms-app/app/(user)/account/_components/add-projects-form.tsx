'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  AlertDescription,
  Card,
  CardContent,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  toast,
  Input,
  Textarea,
} from '@repo/ui/components';
import { AlertCircleIcon, Plus } from '@repo/ui/lib';

type NewProjectFormValues = {
  projectName: string;
  description?: string;
};

export function AddProjectsForm() {
  const [cardVisibility, setCardVisibility] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<NewProjectFormValues>({
    defaultValues: {
      projectName: '',
      description: '',
    },
    mode: 'onTouched',
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  async function onSubmit(data: NewProjectFormValues) {
    setError(null);

    try {
      reset();
      setCardVisibility(false);
      toast.success('Proyecto creado correctamente');
    } catch (err) {
      console.error(err);
    }
  }

  const isDisabled = !isDirty || !isValid || isSubmitting;

  return (
    <>
      <div className="flex justify-end">
        <Button
          className="w-fit"
          onClick={() => setCardVisibility((prev) => !prev)}
        >
          <Plus /> Agregar proyecto
        </Button>
      </div>
      <Card className={`${cardVisibility ? '' : 'hidden'}`}>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 lg:gap-2"
              noValidate
            >
              <div className="flex flex-col gap-4">
                {/* Project name */}
                <FormField
                  control={control}
                  name="projectName"
                  rules={{
                    required: 'El nombre del proyecto es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'Debe tener al menos 2 caracteres',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Nombre del proyecto
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          className=""
                          placeholder="ej. Proyecto curso Angular"
                        />
                      </FormControl>
                      <FormMessage className="mt-1.5 text-xs text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                        Descripción del proyecto
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Breve descripción de los objetivos..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {error && (
                <Alert
                  variant="destructive"
                  className="max-w-md bg-red-50 border border-red-200"
                >
                  <AlertCircleIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
              <div className="flex gap-2 justify-end">
                <Button className="w-fit" type="submit" disabled={isDisabled}>
                  {isSubmitting ? 'Guardando...' : 'Guardar proyecto'}
                </Button>
                <Button
                  variant="secondary"
                  className="w-fit"
                  type="button"
                  onClick={() => {
                    setCardVisibility(false);
                    reset();
                    setError(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
