import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../axios/axios";
import { toast } from "react-toastify";

import CardHeader from "./CampaignCardHeader";
import CardInfo from "./CampaignCardInfo";
import CardFooter from "./CampaignCardFooter";
import CampaignCardRating from "./CampaignCardRating";
import ActionsMenu from "./CampaignActionMenu";
import ConfirmModal from "../../components/ConfirmModal";

function CampaignCard({ campaign, choseCampaign, handleRegister }) {
  const { user } = useAuth();
  const location = useLocation();

  const [popup, setPopup] = useState(null);
  const popupRef = useRef(null);

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteEvent = async () => {
    try {
      setLoading(true);
      await api.delete(`/campaign/${campaign.id}`);
      toast.success("Campaign deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete!");
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <div className="relative hover:shadow-lg text-accent shadow-sm group hover:scale-101 p-4 bg-primary/10 space-y-4 rounded-xl overflow-hidden transition-all duration-300">
      <div className="flex justify-between">
        <h3 className="font-bold text-xl">{campaign.title}</h3>
        <ActionsMenu
          popup={popup}
          campaign={campaign}
          setOpenModal={setOpenModal}
          setPopup={setPopup}
          popupRef={popupRef}
          isAdmin={user?.role === "ADMIN"}
          isDashboard={location.pathname.includes("dashboard")}
        />
      </div>
      <CardHeader title={campaign?.title} campaign={campaign} />
      <CardInfo campaign={campaign} />

      <CampaignCardRating
        campaignId={campaign.id}
        user={user}
        myRating={
          campaign.ratings?.find(
            (r) => r.volunteer?.id === user?.id || r.volunteer === user?.id
          )?.rating
        }
      />

      <hr className="h-px bg-primary border-none" />
      <CardFooter
        campaign={campaign}
        choseCampaign={choseCampaign}
        handleRegister={handleRegister}
        user={user}
        location={location}
      />

      <ConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={deleteEvent}
        loading={loading}
        message="This action cannot be undone."
      />
    </div>
  );
}

export default CampaignCard;
