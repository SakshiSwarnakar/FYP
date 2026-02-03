import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api, apiPublic } from "../axios/axios";
import { useAuth } from "./AuthContext";

const CampainContext = createContext(null)

export const CampaignProvider = ({ children }) => {
    const [campaigns, setCampaigns] = useState(null)
    const [activeCampaign, choseCampaign] = useState(null)
    const [status, setStatus] = useState() // error || loading || success
    const { user } = useAuth()

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const fetchCampaigns = async () => {
        setStatus('loading')
        try {
            const res = await apiPublic.get('/campaign')
            setCampaigns(res?.data)
            setStatus('success')

        } catch (error) {
            toast.error(error.message);
            setStatus('error')

        } finally {
            setStatus(null)
        }
    }

    const handleRegister = async (campaignId) => {
        try {
            const res = await api.post(`/campaign/${campaignId}/apply`,
                { user }
            )
            toast.success(res.message)
        } catch (error) {
            toast.error(error?.message)
        }

    }

    return (
        <CampainContext.Provider value={{ campaigns, activeCampaign, choseCampaign, status, handleRegister, fetchCampaigns }}>
            {children}
        </CampainContext.Provider>
    )
}

export const useCampaign = () => useContext(CampainContext)