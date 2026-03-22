import { Bookmark, CalendarDays, MapPin } from "lucide-react";

function CampaignCardInfo({ campaign }) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
      <InfoItem icon={Bookmark} label={campaign?.category} />
      <InfoItem
        icon={CalendarDays}
        label={campaign?.startDate?.split("T")[0]}
      />
      <InfoItem icon={MapPin} label={campaign?.location} />
      <InfoItem icon={CalendarDays} label={campaign?.endDate?.split("T")[0]} />
    </div>
  );
}

function InfoItem({ icon: Icon, label }) {
  return (
    <p className="flex gap-2 items-center bg-primary/5 rounded-md px-2 py-1 truncate">
      <Icon size={16} className="text-primary" />
      <span className="truncate">{label || "--"}</span>
    </p>
  );
}

export default CampaignCardInfo;
