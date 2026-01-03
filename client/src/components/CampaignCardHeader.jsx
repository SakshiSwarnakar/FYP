import { Ellipsis } from "lucide-react";

function CampaignCardHeader({
    title,
    campaign,
    isAdmin,
    inProfile,
    popup,
    setPopup,
}) {
    return (
        <div>
            <img className="w-full aspect-square object-cover rounded" src={campaign?.attachments[0]?.url || `https://placehold.co/60x60?text=${title}`} />


            {isAdmin && inProfile && (
                <button
                    onClick={() =>
                        popup === campaign.id ? setPopup(null) : setPopup(campaign.id)
                    }
                    className="absolute top-5 right-5 cursor-pointer ellipsis-btn" // add this class!
                >
                    <Ellipsis />
                </button>
            )}
        </div>
    );
}

export default CampaignCardHeader;