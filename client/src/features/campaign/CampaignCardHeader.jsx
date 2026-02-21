import { Info } from "lucide-react";

function CampaignCardHeader({ title, campaign }) {
  return (
    <div className="-mx-5">
      <img
        loading="lazy"
        className="w-full aspect-4/3 object-cover"
        src={
          campaign?.attachments?.[0]?.url ||
          `https://placehold.co/60x60?text=${title}`
        }
      />
    </div>
  );
}

export default CampaignCardHeader;
