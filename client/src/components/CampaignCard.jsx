import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { api } from "../axios/axios";
import { toast } from "react-toastify";

import CardHeader from "./CampaignCardHeader";
import CardInfo from "./CampaignCardInfo";
import CardFooter from "./CampaignCardFooter";
import ActionsMenu from "./CampaignActionMenu";
import ConfirmModal from "./ConfirmModal";

function CampaignCard({ campaign, choseCampaign, handleRegister }) {
    const { user } = useAuth();
    const location = useLocation();


    const [popup, setPopup] = useState(null);
    const popupRef = useRef(null);

    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const closePopup = (e) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target) &&
                !e.target.closest(".ellipsis-btn")
            ) {
                setPopup(null);
            }
        };

        document.addEventListener("mousedown", closePopup);
        return () => document.removeEventListener("mousedown", closePopup);
    }, []);


    const deleteEvent = async () => {
        try {
            setLoading(true);
            await api.delete(`/campaign/${campaign.id}`);
            toast.success("campaign deleted!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete!");
        } finally {
            setLoading(false);
            setOpenModal(false);
        }
    };

    return (
        <div
            className="hover:shadow-lg text-accent shadow-sm group hover:scale-101 p-4 bg-primary/10 space-y-4 relative rounded-xl overflow-hidden transition-all duration-300">
            <ActionsMenu
                popup={popup}
                campaign={campaign}
                setOpenModal={setOpenModal}
                popupRef={popupRef}
            />
            <h3 className="font-bold text-xl">{campaign.title}</h3>
            <CardHeader
                title={campaign?.title}
                campaign={campaign}
                isAdmin={user?.role === "ADMIN"}
                inProfile={location.pathname.includes("dashboard")}
                popup={popup}
                setPopup={setPopup}
                popupRef={popupRef}
            />
            <CardInfo campaign={campaign} />

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
