import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { AlertTriangle, KeyRound, Loader2, RefreshCw, Search, Users, X } from 'lucide-react';
import { useUserProfile } from '../auth/UserProfile';
import { isLoginLogConfigured, listLogins, STORAGE_SCOPE, type LoginRecord } from '../auth/loginTracker';

const formatTime = (d: Date | null) =>
  d ? d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

// "5 min ago", "3 days ago" – quick read of how recent each login is.
const timeAgo = (d: Date | null) => {
  if (!d) return '';
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const isToday = (d: Date | null) => !!d && d.toDateString() === new Date().toDateString();

export default function LoginActivity({ onClose }: { onClose: () => void }) {
  const { instance } = useMsal();
  const { account } = useUserProfile();
  const [rows, setRows] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(isLoginLogConfigured);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = useCallback(() => {
    if (!isLoginLogConfigured) return;
    setLoading(true);
    setError(null);
    listLogins(instance, account)
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [instance, account]);

  useEffect(() => {
    if (!isLoginLogConfigured) return;
    let cancelled = false;
    listLogins(instance, account)
      .then(r => { if (!cancelled) setRows(r); })
      .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [instance, account]);

  // Azure Storage permission not yet approved for this user/app: approve it interactively.
  const needsConsent = !!error && /AADSTS65001|consent_required|interaction_required/i.test(error);
  const grantAccess = () => {
    instance
      .acquireTokenRedirect({ scopes: [STORAGE_SCOPE], account })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter(r => r.email.includes(q) || r.name.toLowerCase().includes(q)) : rows;
  }, [rows, query]);

  const todayCount = rows.filter(r => isToday(r.lastLoginAt)).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl relative border border-slate-300">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Login activity</h3>
              <p className="text-xs text-slate-500">
                {rows.length} user{rows.length === 1 ? '' : 's'} • {todayCount} logged in today
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" title="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isLoginLogConfigured ? (
          <div className="m-5 flex items-start gap-2 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Login log storage is not configured yet. Set <code>VITE_LOGIN_TABLE_URL</code> to the Azure Table
              (<code>https://&lt;account&gt;.table.core.windows.net/UserLogins</code>) and redeploy.
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-5 pt-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={load}
                disabled={loading}
                className="px-3 py-2 text-xs font-bold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-60 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>

            {error && (
              <div className="mx-5 mt-3 flex items-start gap-2 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  {needsConsent ? (
                    <>
                      <p className="font-semibold">OneSRM needs your permission to access Azure Storage.</p>
                      <p className="mt-1">
                        Click Grant access to approve it. If Microsoft says admin approval is required, ask an Entra admin to
                        add <strong>Azure Storage → user_impersonation</strong> under the app's API permissions and grant admin consent.
                      </p>
                      <button
                        onClick={grantAccess}
                        className="mt-2 px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 inline-flex items-center gap-1.5"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Grant access
                      </button>
                    </>
                  ) : (
                    <span className="break-words">{error}</span>
                  )}
                </div>
              </div>
            )}

            <div className="overflow-auto m-5 border border-slate-200 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide sticky top-0">
                  <tr>
                    <th className="text-left font-semibold px-4 py-2.5 w-10">#</th>
                    <th className="text-left font-semibold px-4 py-2.5">Name</th>
                    <th className="text-left font-semibold px-4 py-2.5">Email</th>
                    <th className="text-left font-semibold px-4 py-2.5">Last login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin inline" />
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-400 text-xs">
                        {query ? 'No users match your search.' : 'No logins recorded yet.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((r, i) => (
                      <tr key={r.email} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 text-slate-400">{i + 1}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-800">{r.name || '—'}</td>
                        <td className="px-4 py-2.5 text-slate-600 break-all">{r.email}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className="text-slate-800">{formatTime(r.lastLoginAt)}</span>
                          <span className={`ml-2 text-[11px] ${isToday(r.lastLoginAt) ? 'text-green-600 font-semibold' : 'text-slate-400'}`}>
                            {timeAgo(r.lastLoginAt)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
