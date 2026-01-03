import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom"
import { router } from './routes'
import { AuthProvider } from './context/AuthContext'
import { CampaignProvider } from './context/CampaignContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CampaignProvider>
        <RouterProvider router={router} />
      </CampaignProvider>
    </AuthProvider>
  </StrictMode>
)
