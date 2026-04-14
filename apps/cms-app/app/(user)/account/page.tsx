import { ProfileForm } from './_components/profile-form';

export default function AccountPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Mi perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gestiona tu información personal
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
