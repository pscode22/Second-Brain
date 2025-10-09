import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useUserName } from '../hooks/useUserName';
import { DeleteShareableLink } from '../services/api/generic.api';
import { toast } from 'react-hot-toast';

export default function Profile() {
  const userName = useUserName();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDisableShare = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await DeleteShareableLink();
      if (res?.ok) {
        toast.success(res.message || 'Share link disabled');
      } else {
        const msg = res?.message || 'Failed to disable share link';
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-4">
      <div className="bg-card/80 flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl p-8 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Hello, {userName}</h1>
          <p className="text-muted-foreground text-sm">Manage your Second Brain settings</p>
        </div>

        {error && (
          <div className="w-full rounded-lg bg-red-50/80 py-2 text-center text-sm text-red-600 shadow-sm">
            {error}
          </div>
        )}

        <div className="flex w-full flex-col gap-3">
          <Button
            variant="primary"
            text={loading ? 'Disabling...' : 'Disable Share Link'}
            onClick={handleDisableShare}
            disabled={loading}
            className="w-full rounded-xl py-2.5 font-medium transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          />
          <Button
            variant="secondary"
            text="Logout"
            onClick={logout}
            className="hover:bg-muted w-full rounded-xl border py-2.5 font-medium transition-all"
          />
        </div>

        <p className="text-muted-foreground mt-6 text-xs">Made with ❤️ by Second Brain</p>
      </div>
    </div>
  );
}
