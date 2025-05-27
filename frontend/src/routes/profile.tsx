import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useUserName } from '../hooks/useUserName';

export default function Profile() {
  const userName = useUserName();
  const { logout } = useAuth();

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center gap-3">
      <p className="text-xl font-medium">Hello, {userName}</p>
      <Button variant="primary" text="Logout" className="rounded-3xl pb-2.5" onClick={logout} />
    </div>
  );
}
