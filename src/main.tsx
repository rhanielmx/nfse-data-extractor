import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App.tsx'
import { ReceiptsProvider } from './contexts/useReceipts.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReceiptsProvider>
      <App />
    </ReceiptsProvider>
  </StrictMode>,
)
