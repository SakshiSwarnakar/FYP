import { AtSign, Send, Star } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";
import { useCampaign } from "../../context/CampaignContext";

function CampaignCardRating({
  campaignId,
  user,
  myRating: initialMyRating,
  volunteers = [],
}) {
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);
  const [myRating, setMyRating] = useState(initialMyRating?.rating ?? 0);
  const ratingId = initialMyRating?._id;
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownUsers, setDropdownUsers] = useState([]);
  const [mentionStart, setMentionStart] = useState(null);
  const textareaRef = useRef(null);
  const { addComment } = useCampaign();

  const campaignUsers = volunteers.map((v) => ({
    id: v.volunteer._id,
    firstName: v.volunteer.firstName,
    lastName: v.volunteer.lastName,
  }));

  const parseCommentParts = (text) => {
    const parts = [];
    const regex = /@([a-zA-Z0-9._]+)/g;
    let lastIndex = 0,
      match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex)
        parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
      parts.push({ type: "mention", value: match[0] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length)
      parts.push({ type: "text", value: text.slice(lastIndex) });
    return parts;
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
    const cursorPos = e.target.selectionStart;
    const mentionMatch = value.slice(0, cursorPos).match(/@([a-zA-Z0-9._]*)$/);
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      setMentionStart(cursorPos - mentionMatch[0].length);
      const filtered = campaignUsers.filter(
        (u) =>
          u.firstName.toLowerCase().startsWith(query) ||
          u.lastName.toLowerCase().startsWith(query),
      );
      setDropdownUsers(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
      setMentionStart(null);
    }
  };

  const handleMentionSelect = (selectedUser) => {
    const before = comment.slice(0, mentionStart);
    const after = comment.slice(textareaRef.current.selectionStart);
    setComment(`${before}@${selectedUser.firstName} ${after}`);
    setShowDropdown(false);
    textareaRef.current.focus();
  };

  const handleRate = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      navigate("/login");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      let currentRatingId = ratingId;

      // If no rating exists yet, create one first
      if (!currentRatingId) {
        const res = await api.post(`/campaign/${campaignId}/rating`, {
          volunteer: user.id,
          rating: myRating,
        });

        if (res.status === 'error') {
          throw new Error(res.message || 'Failed to submit rating');
        }

        // Get the rating ID from response
        currentRatingId = res.data?.id || res.data?.ratingId;
      }

      // Now add comment using the rating ID (either existing or newly created)
      if (comment.trim()) {
        await addComment(campaignId, currentRatingId, comment);
      }

      toast.success("Thanks for your feedback!");
      setComment("");

    } catch (err) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const displayRating = hoverRating || myRating;
  const commentParts = parseCommentParts(comment);
  const hasMentions = commentParts.some((p) => p.type === "mention");

  return (
    <form
      onSubmit={handleRate}
      className={`w-full space-y-4 ${!user ? "blur-sm pointer-events-none" : ""}`}
    >
      {/* Star Rating */}
      <div className="flex items-center gap-1">
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
              onClick={() => setMyRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-40 disabled:pointer-events-none"
              aria-label={`${value} star${value !== 1 ? "s" : ""}`}
            >
              <Star
                size={22}
                className={`transition-colors duration-150 ${value <= displayRating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-gray-200"
                  }`}
              />
            </button>
          ))}
        </div>
        {myRating > 0 && (
          <span className="ml-2 text-xs font-semibold text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            {myRating}/5
          </span>
        )}
      </div>

      {/* Textarea + mention dropdown */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write your comment… use @ to mention someone"
          rows={3}
          className="w-full px-4 py-3 text-sm border border-primary/15 rounded-xl outline-none resize-none
            focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-150
            hover:border-primary/25 bg-white text-gray-700 placeholder:text-gray-300"
        />

        {/* @ hint icon */}
        <div className="absolute bottom-3 right-3 text-gray-200">
          <AtSign size={14} />
        </div>

        {/* Mention dropdown */}
        {showDropdown && (
          <div className="absolute z-20 left-0 mt-1 w-52 bg-white border border-primary/12 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {dropdownUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onMouseDown={() => handleMentionSelect(u)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {u.firstName[0]}
                </span>
                {u.firstName} {u.lastName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mention highlight preview */}
      {comment && hasMentions && (
        <div className="px-3 py-2.5 bg-primary/4 border border-primary/12 rounded-xl text-sm leading-relaxed text-gray-600">
          {commentParts.map((part, i) =>
            part.type === "mention" ? (
              <span
                key={i}
                className="text-primary font-semibold bg-primary/10 rounded-md px-1 mx-0.5"
              >
                {part.value}
              </span>
            ) : (
              <span key={i}>{part.value}</span>
            ),
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!user || loading}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold
          hover:bg-primary/90 hover:-translate-y-px active:translate-y-0 transition-all duration-150 shadow-sm
          disabled:opacity-40 disabled:pointer-events-none"
      >
        <Send size={14} />
        {loading ? "Posting…" : "Post Comment"}
      </button>
    </form>
  );
}

export default CampaignCardRating;
