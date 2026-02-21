import { Link, useLocation, useNavigate } from "react-router";
import { MessageSquareText } from "lucide-react";
import { useCampaign } from "../../context/CampaignContext";

function EventCardFooter({ campaign, choseCampaign, user, location }) {
  const navigate = useNavigate()
  const { handleRegister, handlePublish } = useCampaign();

  const renderButton = () => {
    const loc =
      !location.pathname.includes("profile") ||
      !location.pathname.includes("dashboard");
    const role = user?.role == "VOLUNTEER";
    const myStatus = campaign?.myVolunteerStatus;
    if (loc && role) {
      return myStatus == "pending"
        ? "Pending"
        : myStatus == "accepted"
          ? "Accepted"
          : myStatus == 'rejected' ? "Rejected"
            : "Register";
    }
    return user?.role == 'ADMIN' ? campaign.status == 'DRAFT' ? 'Publish' : "Published" : 'Register';
  };
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

      {renderButton() && (
        <button
          title={renderButton()}
          disabled={renderButton() == "Pending" || renderButton() == "Accepted" || renderButton() == 'Rejected' || renderButton() == 'Published'}
          onClick={() => {
            if (!user) {
              navigate('/login')
              return;
            }
            if (user.role == 'VOLUNTEER') {
              handleRegister(campaign?.id)
              return;
            }
            handlePublish(campaign?.id)
            return;
          }}
          className="secondary-btn disabled:cursor-not-allowed!"
        >
          {renderButton()}
        </button>
      )}
    </div>
  );
}

export default EventCardFooter;
