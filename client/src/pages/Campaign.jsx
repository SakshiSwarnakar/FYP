import { useEffect } from "react";
import CampaignCard from "../features/campaign/CampaignCard";
import Loading from "../components/Loading";
import { useCampaign } from "../context/CampaignContext";
import { NoCampaignsFound } from "./Home";

export default function Campaign() {
  const { campaigns, status, fetchCampaigns } = useCampaign();

  useEffect(() => {
    fetchCampaigns()
  }, [])

  if (status == "loading") {
    return <Loading />;
  }
  return (
    <div className="container">
      <h2 className="text-5xl font-bold text-primary mb-12">Campaigns</h2>
      <div className="grid-container">
        {campaigns?.map((campaign) => (
          <CampaignCard campaign={campaign} />
        ))}
      </div>
      {!campaigns?.length && (
        <div className="mt-8 rounded-2xl border border-primary/20 bg-white/60 shadow-sm overflow-hidden">
          <NoCampaignsFound isCategoryFilter={null} />
        </div>
      )}
    </div>
  );
}
