import { useRef, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";
import { useAuth } from "../../context/AuthContext";

import ConfirmModal from "../../components/ConfirmModal";
import ActionsMenu from "./CampaignActionMenu";
import CardFooter from "./CampaignCardFooter";
import CardHeader from "./CampaignCardHeader";
import CardInfo from "./CampaignCardInfo";

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
    <div className="relative group rounded-2xl overflow-hidden bg-primary/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-primary/20">
      <div className="flex justify-between items-start p-4">
        <h3 className="font-bold text-xl text-accent tracking-wide line-clamp-1">
          {campaign.title}
        </h3>
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

      <div className="p-4">
        <CardInfo campaign={campaign} />

        <hr className="my-4 border-primary/20" />

        <CardFooter
          campaign={campaign}
          choseCampaign={choseCampaign}
          handleRegister={handleRegister}
          user={user}
          location={location}
        />
      </div>

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
