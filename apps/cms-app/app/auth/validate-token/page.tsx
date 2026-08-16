import { Suspense } from 'react';
import { ValidateTokenForm } from './_components/validate-token-form';

export default function ValidateTokenPage() {
  return (
    <Suspense>
      <ValidateTokenForm />
    </Suspense>
  );
}
