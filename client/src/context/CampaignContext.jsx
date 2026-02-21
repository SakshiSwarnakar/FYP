import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import { useAuth } from "./AuthContext";

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  const [campaigns, setCampaigns] = useState(null);
  const [activeCampaign, choseCampaign] = useState(null);
  const [status, setStatus] = useState(); // error || loading || success
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchCampaigns({ createdBy: user?.id })
      return;
    }
    fetchCampaigns()
  }, [user]);

  const fetchCampaigns = async (query = null) => {
    setStatus("loading");
    try {
      const res = await api.get("/campaign", {
        params: query ? { ...query } : {},
      });
      setCampaigns(res?.data?.campaigns);
      setStatus("success");
    } catch (error) {
      // toast.error(error.message);
      setStatus("error");
    } finally {
      setStatus(null);
    }
  };

  const handleRegister = async (campaignId) => {
    try {
      const res = await api.post(`/campaign/${campaignId}/apply`, { user });
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handlePublish = async (campaignId) => {
    try {
      const res = await api.patch(`/campaign/${campaignId}/publish`)

      if (res.status == 'success') {
        toast.success(res.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleVolunteerAttendance = async (id, attendanceStatus, volunteerId) => {
    try {
      const res = await api.patch(
        `/attendance/${id}/attendance/${volunteerId}`,
        { attendanceStatus }
      );
      if (res.status == 'success') {
        toast.success(res.message);
        fetchCampaigns({ createdBy: user?.id })
        return res.data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        activeCampaign,
        status,
        choseCampaign,
        handleVolunteerAttendance,
        handleRegister,
        fetchCampaigns,
        handlePublish
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => useContext(CampaignContext);
