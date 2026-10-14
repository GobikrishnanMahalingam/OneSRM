// Entry for redirect.html: Entra ID redirects here after sign-in/sign-out, and
// MSAL forwards the response to the main app (or to the popup/iframe opener).
import { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge';

broadcastResponseToMainFrame().catch((error: unknown) => {
  console.error('Sign-in redirect failed', error);
  window.location.replace('/');
});
