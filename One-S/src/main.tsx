import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EventType, PublicClientApplication, type AuthenticationResult } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import './index.css'
import App from './dashboard.tsx'
import { isAuthConfigured, msalConfig } from './auth/authConfig'
import { AuthConfigMissing, AuthGate } from './auth/AuthGate'

const root = createRoot(document.getElementById('root')!)

async function start() {
  if (!isAuthConfigured) {
    root.render(<AuthConfigMissing />)
    return
  }

  const msal = new PublicClientApplication(msalConfig)
  await msal.initialize()

  msal.addEventCallback(event => {
    if (event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
      const account = (event.payload as AuthenticationResult | null)?.account
      if (account) msal.setActiveAccount(account)
    }
  })

  // Complete a sign-in that just returned from Entra ID, if any.
  let initialError: string | undefined
  try {
    const result = await msal.handleRedirectPromise()
    if (result?.account) msal.setActiveAccount(result.account)
  } catch (e) {
    initialError = e instanceof Error ? e.message : String(e)
  }
  if (!msal.getActiveAccount() && msal.getAllAccounts().length > 0) {
    msal.setActiveAccount(msal.getAllAccounts()[0])
  }

  root.render(
    <StrictMode>
      <MsalProvider instance={msal}>
        <AuthGate initialError={initialError}>
          <App />
        </AuthGate>
      </MsalProvider>
    </StrictMode>,
  )
}

void start()
