import { useEffect } from "react";
import { useNavigate } from "react-router";
import Loading from "../../components/Loading";
import CampaignCard from "../../features/campaign/CampaignCard";
import { useCampaign } from "../../context/CampaignContext";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle2 } from "lucide-react";
import CampaignVolunteers from "./CampaignVolunteers";

function VolunteerAccepted() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { campaigns, fetchCampaigns, status, choseCampaign, handleRegister } = useCampaign();



  const campaignList = Array.isArray(campaigns)
    ? campaigns
    : campaigns?.data ?? [];
  const acceptedCampaigns = campaignList.filter(
    (c) => c.myVolunteerStatus === "accepted"
  );

  useEffect(() => {
    fetchCampaigns()

    if (!loading && !user) {
      navigate("/");
    }
  }, [loading, user, navigate]);

  if (loading || status === "loading") {
    return <Loading />;
  }

  if (user?.role === "ADMIN") {
    return <CampaignVolunteers />;
  }

  return (
    <>
      <div className="flex-1 flex items-center justify-between">
        <h1 className="font-bold text-primary mb-10 text-5xl">
          Accepted Events
        </h1>
      </div>
      <p className="text-accent/80 mb-6">
        Campaigns where your volunteer application was accepted.
      </p>

      {acceptedCampaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl bg-primary/5 border border-primary/20">
          <CheckCircle2 className="w-16 h-16 text-primary/40 mb-4" />
          <p className="text-lg font-medium text-accent">
            No accepted events yet
          </p>
          <p className="text-sm text-accent/70 mt-1">
            When organizers accept your application, those events will appear
            here.
          </p>
        </div>
      ) : (
        <div className="grid-container">
          {acceptedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              handleRegister={handleRegister}
              choseCampaign={choseCampaign}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default VolunteerAccepted;
