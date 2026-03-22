import { Link, useLocation, useNavigate } from "react-router";
import { MessageSquareText } from "lucide-react";
import { useCampaign } from "../../context/CampaignContext";
import { useState } from "react";

function EventCardFooter({ campaign, choseCampaign, user, location }) {
  const navigate = useNavigate();
  const { handleRegister, handlePublish } = useCampaign();

  const [latestStatus, setLatestStatus] = useState(null);

  const changeCampaignStatus = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role == "VOLUNTEER") {
      const status = await handleRegister(campaign?.id);
      setLatestStatus(status);
      return;
    }

    const status = await handlePublish(campaign?.id);
    setLatestStatus(status);
    return;
  };

  const renderButton = () => {
    const loc =
      !location.pathname.includes("profile") ||
      !location.pathname.includes("dashboard");

    const role = user?.role == "VOLUNTEER";

    const myStatus = latestStatus || campaign?.myVolunteerStatus;

    if (loc && role) {
      return myStatus == "pending"
        ? "Pending"
        : myStatus == "accepted"
        ? "Accepted"
        : myStatus == "rejected"
        ? "Rejected"
        : "Register";
    }

    const adminStatus = latestStatus || campaign.status;

    return user?.role == "ADMIN"
      ? adminStatus == "DRAFT"
        ? "Publish"
        : "Published"
      : "Register";
  };

  const buttonText = renderButton();

  return (
    <div className="flex gap-2 items-center justify-between pt-2">
      <button
        onClick={() => choseCampaign(campaign)}
        className="flex gap-1 cursor-pointer items-center text-gray-600 hover:text-primary text-sm"
      >
        <MessageSquareText size={16} />
        <span>{campaign?.comments?.length || 0}</span>
      </button>

      <Link to={`../campaign/${campaign.id}`} className="ml-auto primary-btn">
        View
      </Link>

      {buttonText && (
        <button
          title={buttonText}
          disabled={
            buttonText == "Pending" ||
            buttonText == "Accepted" ||
            buttonText == "Rejected" ||
            buttonText == "Published"
          }
          onClick={changeCampaignStatus}
          className="secondary-btn disabled:cursor-not-allowed!"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default EventCardFooter;