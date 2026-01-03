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
  const load = async () => {
    try {
      setStatus('loading')
      const res = await apiPublic.get('/campaign')
      setCampaigns(res?.data)
      setStatus('success')
    } catch (error) {
      toast.error(error.message)
      setStatus('error')
    }
  }
  load()
}, [])

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
        <CampainContext.Provider value={{ campaigns, activeCampaign, choseCampaign, status, handleRegister }}>
            {children}
        </CampainContext.Provider>
    )
}

export const useCampaign = () => useContext(CampainContext)