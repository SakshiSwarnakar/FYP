import { useState } from "react";
import { Star } from "lucide-react";
import { api } from "../../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function CampaignCardRating({ campaignId, user, myRating: initialMyRating }) {
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);
  const [myRating, setMyRating] = useState(initialMyRating ?? 0);
  const [loading, setLoading] = useState(false);

  const handleRate = async (rating) => {
    if (!user?.id) navigate("/login");
    if (!user?.id || loading) return;
    setLoading(true);
    try {
      await api.post(`/campaign/${campaignId}/rating`, {
        volunteer: user.id,
        rating,
      });
      setMyRating(rating);
      toast.success("Thanks for your rating!");
    } catch (err) {
      toast.error(err?.message ?? "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  // if (!user) return null;

  const displayRating = hoverRating || myRating;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div
        className="flex items-center gap-0.5"
        role="group"
        aria-label="Rate this campaign"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={loading}
            onClick={() => handleRate(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none"
            aria-label={`${value} star${value !== 1 ? "s" : ""}`}
          >
            <Star
              size={20}
              className={`shrink-0 transition-colors ${
                value <= displayRating
                  ? "fill-primary text-primary"
                  : "fill-transparent text-primary/30"
              }`}
            />
          </button>
        ))}
      </div>
      {myRating > 0 && (
        <span className="text-xs text-accent/60">({myRating}/5)</span>
      )}
    </div>
  );
}

export default CampaignCardRating;
