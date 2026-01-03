import { Pencil, Trash } from "lucide-react";
import { Link } from 'react-router'

function CampaignActionsMenu({ popup, campaign, setOpenModal, popupRef }) {
    if (popup !== campaign.id) return null;

    return (
        <div
            ref={popupRef}
            className="absolute top-12 right-4 bg-white shadow-xl rounded-xl overflow-hidden animate-[fadeIn_0.15s_ease-out,scaleIn_0.15s_ease-out]"
            style={{ transformOrigin: "top right" }}
        >
            <Link to={`create-campaign/${campaign.id}`} className=" p-2 hover:bg-gray-100 w-full flex items-center gap-2">
                <Pencil size={16} /> Edit
            </Link>

            <button
                onClick={() => setOpenModal(true)}
                className="p-2 hover:bg-red-100 text-red-600 w-full flex items-center gap-2"
            >
                <Trash size={16} /> Delete
            </button>
        </div>
    );
}

export default CampaignActionsMenu;