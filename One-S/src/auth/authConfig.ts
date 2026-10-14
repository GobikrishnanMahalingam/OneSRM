import type { Configuration, RedirectRequest } from '@azure/msal-browser';

// Microsoft Entra ID (Azure AD) app registration. Set these in .env.local for
// local dev, and as repository variables for the GitHub Actions build.
const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID ?? '';
const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID ?? '';

export const isAuthConfigured = Boolean(clientId && tenantId);

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    // Lightweight bridge page (redirect.html) that hands the auth response back to the app.
    redirectUri: `${window.location.origin}/redirect.html`,
    postLogoutRedirectUri: `${window.location.origin}/?signedOut=1`,
  },
  cache: {
    // Shared across tabs so users sign in once per browser session.
    cacheLocation: 'localStorage',
  },
};

// User.Read lets us read the signed-in user's profile from Microsoft Graph.
export const loginRequest: RedirectRequest = {
  scopes: ['User.Read'],
};

export const GRAPH_ME_URL =
  'https://graph.microsoft.com/v1.0/me?$select=displayName,givenName,surname,mail,userPrincipalName,jobTitle,department,employeeId,officeLocation,city,country';
