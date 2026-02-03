// Providers.jsx
import { CampaignProvider } from "../context/CampaignContext"
import { AuthProvider } from "../context/AuthContext"

export default function Providers({ children }) {
    return (
        <AuthProvider>
            <CampaignProvider>
                {children}
            </CampaignProvider>
        </AuthProvider>
    )
}
