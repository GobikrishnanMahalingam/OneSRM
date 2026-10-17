import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMsal } from '@azure/msal-react';
import type { AccountInfo } from '@azure/msal-browser';
import { GRAPH_ME_URL, loginRequest } from './authConfig';
import { getLastLoginTime, isAdmin } from './loginTracker';

export type UserProfile = {
  name: string;
  empId: string;
  department: string;
  role: string;
  location: string;
  initials: string;
  email: string;
  avatarBg: string;
  lastLogin: string;
};

type GraphUser = {
  displayName?: string | null;
  mail?: string | null;
  userPrincipalName?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  employeeId?: string | null;
  officeLocation?: string | null;
  city?: string | null;
  country?: string | null;
};

type UserProfileContextValue = { profile: UserProfile; account: AccountInfo; isAdmin: boolean; signOut: () => void };

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

const getInitials = (name: string) =>
  name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase() || '?';

export function UserProfileProvider({ account, children }: { account: AccountInfo; children: ReactNode }) {
  const { instance } = useMsal();
  const [graphUser, setGraphUser] = useState<GraphUser | null>(null);

  // Enrich the ID token claims with directory details (employee ID, department, title, office).
  useEffect(() => {
    let cancelled = false;
    instance
      .acquireTokenSilent({ ...loginRequest, account })
      .then(({ accessToken }) => fetch(GRAPH_ME_URL, { headers: { Authorization: `Bearer ${accessToken}` } }))
      .then(res => (res.ok ? res.json() : Promise.reject(new Error(`Graph /me returned ${res.status}`))))
      .then((user: GraphUser) => { if (!cancelled) setGraphUser(user); })
      .catch((error: unknown) => console.warn('Could not load profile from Microsoft Graph', error));
    return () => { cancelled = true; };
  }, [instance, account]);

  const value = useMemo<UserProfileContextValue>(() => {
    const name = graphUser?.displayName || account.name || account.username;
    return {
      profile: {
        name,
        empId: graphUser?.employeeId ?? '',
        department: graphUser?.department ?? '',
        role: graphUser?.jobTitle ?? '',
        location: [graphUser?.officeLocation, graphUser?.city, graphUser?.country].filter(Boolean).join(', '),
        initials: getInitials(name),
        email: graphUser?.mail || graphUser?.userPrincipalName || account.username,
        avatarBg: 'from-blue-600 to-indigo-800',
        lastLogin: getLastLoginTime(account)?.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) ?? '',
      },
      account,
      isAdmin: isAdmin(account),
      signOut: () => { void instance.logoutRedirect({ account }); },
    };
  }, [graphUser, account, instance]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used inside <UserProfileProvider>');
  return ctx;
}
