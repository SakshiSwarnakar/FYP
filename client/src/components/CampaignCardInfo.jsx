import { Bookmark, Building2, CalendarDays, MapPin } from "lucide-react";

function CampaignCardInfo({ campaign }) {
    return (
        <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoItem icon={Bookmark} label={campaign?.category} />
            <InfoItem icon={Building2} label={campaign?.organizer} />
            <InfoItem icon={MapPin} label={campaign?.location} />
            <InfoItem
                icon={CalendarDays}
                label={campaign?.date?.split("T")[0]}
            />
        </div>
    );
}

function InfoItem({ icon: Icon, label }) {
    return (
        <p className="flex gap-2 items-center text-accent text-sm">
            <Icon size={16} className="text-accent" />
            <span className="truncate">{label || "--"}</span>
        </p>
    );
}

export default CampaignCardInfo;