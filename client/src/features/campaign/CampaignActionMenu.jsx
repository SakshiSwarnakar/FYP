import { Info, Pencil, Trash } from "lucide-react";
import { Link } from "react-router";

function CampaignActionsMenu({
  isAdmin,
  isDashboard,
  popup,
  campaign,
  setPopup,
  setOpenModal,
  popupRef,
}) {
  return (
    <div
      ref={popupRef}
      className="relative"
      style={{ transformOrigin: "top right" }}
    >
      {isAdmin && isDashboard && (
        <button
          onClick={() =>
            popup === campaign.id ? setPopup(null) : setPopup(campaign.id)
          }
          className="cursor-pointer ellipsis-btn" // add this class!
        >
          <Info />
        </button>
      )}
      <div
        className={`absolute top-8 right-0 bg-white shadow-xl rounded-xl overflow-hidden animate-[fadeIn_0.15s_ease-out,scaleIn_0.15s_ease-out] ${
          popup === campaign?.id ? "block" : "hidden"
        }`}
      >
        <Link
          to={`create-campaign/${campaign.id}`}
          className=" p-2 hover:bg-gray-100 w-full flex items-center gap-2"
        >
          <Pencil size={16} /> Edit
        </Link>

        <button
          onClick={() => {
            setOpenModal(true);
            setPopup(null);
          }}
          className="p-2 hover:bg-red-100 text-red-600 w-full flex items-center gap-2"
        >
          <Trash size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

export default CampaignActionsMenu;
