import { useEffect, useState, type ReactNode } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Loader2, LogIn, AlertTriangle } from 'lucide-react';
import { loginRequest } from './authConfig';
import { UserProfileProvider } from './UserProfile';

const AuthScreen = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-[#0b1329] flex items-center justify-center p-4 font-sans">
    <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center">
      <img src="/brand/1srm-7-shield.png" alt="OneSRM" className="h-16 mx-auto mb-4 object-contain" />
      <h1 className="font-bold text-lg text-slate-900">Welcome to OneSRM</h1>
      <p className="text-xs text-slate-500 mt-1 mb-6">Sign in with your SRM Tech account to continue.</p>
      {children}
    </div>
  </div>
);

export const AuthConfigMissing = () => (
  <AuthScreen>
    <div className="flex items-start gap-2 text-left text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>
        SSO is not configured. Set <code>VITE_ENTRA_CLIENT_ID</code> and <code>VITE_ENTRA_TENANT_ID</code> (see <code>.env.example</code>).
      </span>
    </div>
  </AuthScreen>
);

export function AuthGate({ initialError, children }: { initialError?: string; children: ReactNode }) {
  const { instance, inProgress, accounts } = useMsal();
  const [error, setError] = useState<string | undefined>(initialError);
  const activeId = instance.getActiveAccount()?.homeAccountId;
  const account = accounts.find(a => a.homeAccountId === activeId) ?? accounts[0];
  // Drop the ?signedOut marker left by the post-logout redirect.
  useEffect(() => {
    if (window.location.search.includes('signedOut')) window.history.replaceState(null, '', window.location.pathname);
  }, []);

  // Always show Microsoft's account picker so the user can choose their work account or type another email.
  const signIn = () => {
    setError(undefined);
    instance
      .loginRedirect({ ...loginRequest, prompt: 'select_account' })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  };

  if (account) {
    return <UserProfileProvider account={account}>{children}</UserProfileProvider>;
  }

  const busy = inProgress !== InteractionStatus.None;
  return (
    <AuthScreen>
      {error && (
        <div className="flex items-start gap-2 text-left text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="break-words">Sign-in failed: {error}</span>
        </div>
      )}
      <button
        onClick={signIn}
        disabled={busy}
        className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        {busy ? 'Signing you in…' : 'Sign in with Microsoft'}
      </button>
    </AuthScreen>
  );
}
