import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './lib/auth'
import { I18nProvider } from './lib/i18n'
import { ReferenceProvider } from './lib/useReference'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <ReferenceProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ReferenceProvider>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
)
