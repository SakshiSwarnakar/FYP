import { Link } from "react-router";
import { MessageSquareText } from "lucide-react";
import { useCampaign } from "../context/CampaignContext";

function EventCardFooter({ campaign, choseCampaign, user, location }) {
    const { handleRegister } = useCampaign()
    return (
        <div className="flex gap-2 items-center justify-between pt-2">
            <button
                onClick={() => choseCampaign(campaign)}
                className="flex gap-1 cursor-pointer items-center text-gray-600 hover:text-primary text-sm"
            >
                <MessageSquareText size={16} />
                <span>{campaign?.comments?.length || 0}</span>
            </button>

            <Link to={`campaign/${campaign.id}`} className="ml-auto primary-btn">
                View
            </Link>

            {(user?.role === "VOLUNTEER" && !location.pathname.includes("profile")) && (
                <button onClick={() => handleRegister(campaign?.id)} className="secondary-btn">
                    Register
                </button>
            )}
        </div>
    );
}

export default EventCardFooter;