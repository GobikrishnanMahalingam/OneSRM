import type { AccountInfo, IPublicClientApplication } from '@azure/msal-browser';

// Prototype login log: one row per user in Azure Table Storage, written straight from the
// browser with the signed-in user's Entra token. To be replaced by a backend + RDBMS.
//
// Table "UserLogins": PartitionKey = "users", RowKey = lower-cased email.
// Signing in again upserts (merges) the same row, so the list never grows for existing users.
const tableUrl = import.meta.env.VITE_LOGIN_TABLE_URL?.replace(/\/+$/, '') ?? '';

const STORAGE_SCOPE = 'https://storage.azure.com/user_impersonation';

const lastLoginKey = (account: AccountInfo) => `onesrm.lastLogin.${account.username.toLowerCase()}`;

// When this user last signed in on this browser. Falls back to the ID token's sign-in time
// for sessions that started before login times were recorded.
export function getLastLoginTime(account: AccountInfo): Date | null {
  try {
    const stored = localStorage.getItem(lastLoginKey(account));
    if (stored) return new Date(stored);
  } catch {
    // storage unavailable
  }
  const claims = account.idTokenClaims as { auth_time?: number; iat?: number } | undefined;
  const seconds = claims?.auth_time ?? claims?.iat;
  return seconds ? new Date(seconds * 1000) : null;
}

export async function recordLogin(msal: IPublicClientApplication, account: AccountInfo) {
  try {
    localStorage.setItem(lastLoginKey(account), new Date().toISOString());
  } catch {
    // storage unavailable
  }
  if (!tableUrl) return;

  const email = account.username.toLowerCase();
  const { accessToken } = await msal.acquireTokenSilent({ scopes: [STORAGE_SCOPE], account });

  const rowKey = encodeURIComponent(email.replace(/'/g, "''"));
  // PATCH without If-Match = "Insert Or Merge": creates the row the first time, updates it afterwards.
  const res = await fetch(`${tableUrl}(PartitionKey='users',RowKey='${rowKey}')`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'x-ms-version': '2020-12-06',
      'x-ms-date': new Date().toUTCString(),
      'Content-Type': 'application/json',
      Accept: 'application/json;odata=nometadata',
    },
    body: JSON.stringify({
      Email: email,
      Name: account.name ?? '',
      LastLoginAt: new Date().toISOString(),
      'LastLoginAt@odata.type': 'Edm.DateTime',
      LastUrl: window.location.origin + window.location.pathname,
    }),
  });
  if (!res.ok) throw new Error(`Login log write failed: ${res.status} ${await res.text()}`);
}

export const isLoginLogConfigured = Boolean(tableUrl);

export type LoginRecord = { email: string; name: string; lastLoginAt: Date | null; lastUrl: string };

type LoginEntity = { Email?: string; RowKey?: string; Name?: string; LastLoginAt?: string; LastUrl?: string };

// Reads every user's row (following Table Storage continuation tokens), newest login first.
export async function listLogins(msal: IPublicClientApplication, account: AccountInfo): Promise<LoginRecord[]> {
  if (!tableUrl) return [];
  const { accessToken } = await msal.acquireTokenSilent({ scopes: [STORAGE_SCOPE], account });

  const entities: LoginEntity[] = [];
  let continuation = '';
  do {
    const res = await fetch(
      `${tableUrl}()?$filter=${encodeURIComponent("PartitionKey eq 'users'")}&$select=RowKey,Email,Name,LastLoginAt,LastUrl${continuation}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-ms-version': '2020-12-06',
          'x-ms-date': new Date().toUTCString(),
          Accept: 'application/json;odata=nometadata',
        },
      },
    );
    if (!res.ok) throw new Error(`Could not load login log: ${res.status} ${await res.text()}`);
    entities.push(...((await res.json()) as { value: LoginEntity[] }).value);

    const nextPartition = res.headers.get('x-ms-continuation-NextPartitionKey');
    const nextRow = res.headers.get('x-ms-continuation-NextRowKey');
    continuation = nextPartition
      ? `&NextPartitionKey=${encodeURIComponent(nextPartition)}${nextRow ? `&NextRowKey=${encodeURIComponent(nextRow)}` : ''}`
      : '';
  } while (continuation);

  return entities
    .map(e => ({
      email: e.Email || e.RowKey || '',
      name: e.Name ?? '',
      lastLoginAt: e.LastLoginAt ? new Date(e.LastLoginAt) : null,
      lastUrl: e.LastUrl ?? '',
    }))
    .sort((a, b) => (b.lastLoginAt?.getTime() ?? 0) - (a.lastLoginAt?.getTime() ?? 0));
}

// Admins: users assigned the Entra app role "Admin" on the OneSRM app registration.

export function isAdmin(account: AccountInfo) {
  const roles = (account.idTokenClaims as { roles?: string[] } | undefined)?.roles ?? [];
  return roles.includes('Admin');
}
