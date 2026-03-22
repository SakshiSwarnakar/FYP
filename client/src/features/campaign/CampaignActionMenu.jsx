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
    <div ref={popupRef} className="relative">
      {isAdmin && isDashboard && (
        <button
          onClick={() =>
            popup === campaign.id ? setPopup(null) : setPopup(campaign.id)
          }
          className="cursor-pointer p-2 rounded-full hover:bg-primary/20 text-accent transition-colors"
        >
          <Info size={18} />
        </button>
      )}

      <div
        className={`absolute z-10 top-9 right-0 w-40 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right ${popup === campaign?.id
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
          }`}
      >
        <Link
          to={`create-campaign/${campaign.id}`}
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/10 transition-colors text-gray-700"
        >
          <Pencil size={16} /> Edit
        </Link>

        <button
          onClick={() => {
            setOpenModal(true);
            setPopup(null);
          }}
          className="flex items-center gap-2 px-3 py-2 w-full text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

export default CampaignActionsMenu;
