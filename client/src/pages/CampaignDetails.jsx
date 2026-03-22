import {
  Bookmark,
  MapPin,
  Plus,
  TableOfContents,
  Timer,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { useCampaign } from "../context/CampaignContext";
import CampaignCardRating from "../features/campaign/CampaignCardRating";
function timeAgo(date) {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function Campaign() {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskPop, openPopup] = useState(false);
  const [taskList, setTaskList] = useState();
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const isAdmin = useMemo(() => user?.role === "ADMIN", [user]);
  const isVolunteer = useMemo(() => user?.role === "VOLUNTEER", [user]);

  const { commentsByRating, getCommentsByRating, loadComments, deleteComment, addComment } = useCampaign();

  const loadTask = async () => {
    const res = await api.get(`/task/campaigns/${id}/tasks`);
    if (res.status == "error") {
      toast.error(res.error.message);
      return;
    }
    setTaskList(res.data);
  };

  const loadCampaign = async () => {
    try {
      const res = await api.get(`/campaign/${id}`);
      if (res.status == "success") setCampaign(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Campaign ================= */

  useEffect(() => {
    loadCampaign();
  }, [id]);

  useEffect(() => {
    if (taskPop) {
      loadTask();
      return;
    }
  }, [taskPop]);

  useEffect(() => {
    if (campaign) {
      const ratings = campaign?.ratings;
      for (const rating of ratings) {
        loadComments(id, rating?._id);
      }
    }
  }, [id, campaign]);

  const allCommentsForCampaign = useMemo(() => {
    if (!campaign?.ratings) return [];

    // Combine comments from all ratings of this campaign
    return campaign.ratings.flatMap(rating =>
      getCommentsByRating(rating._id) || []
    );
  }, [campaign, commentsByRating]);


  /* ================= Volunteers (ADMIN only) ================= */

  if (loading) return <Loading />;

  if (!campaign) return <p className="py-5 text-xl text-primary">Campign not found</p>;

  return (
    <div className="container mx-auto px-4 py-4">
      {/* ── Hero Image ── */}
      {campaign?.attachments && (
        <div className="relative mb-10 rounded-2xl overflow-hidden shadow-lg">
          <img
            loading="lazy"
            className="h-[480px] w-full object-cover"
            src={
              campaign?.attachments?.[0]?.url || "https://placehold.co/1400x620"
            }
            alt="campaign"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}

      {/* ── Event Header ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-2">
        <h1 className="text-primary text-4xl font-bold tracking-tight leading-tight flex-1">
          {campaign.title}
        </h1>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isAdmin && (
            <Link
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium shadow-sm hover:bg-primary/90 hover:-translate-y-px transition-all duration-150"
              to="create-task"
            >
              <Plus size={15} /> Create Task
            </Link>
          )}
          {(isVolunteer || isAdmin) && (
            <button
              onClick={() => openPopup(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 text-primary bg-primary/5 text-sm font-medium hover:bg-primary/10 hover:-translate-y-px transition-all duration-150"
            >
              <TableOfContents size={15} />
              <span className="hidden md:inline">View Tasks</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Meta Badges ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { icon: <Bookmark size={14} />, label: campaign.category },
          {
            icon: <Timer size={14} />,
            label: campaign?.endDate?.split("T")[0],
          },
          { icon: <MapPin size={14} />, label: campaign.location },
        ].map(
          ({ icon, label }) =>
            label && (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 text-primary text-sm font-medium border border-primary/15"
              >
                {icon} {label}
              </span>
            ),
        )}
      </div>

      {/* ── About ── */}
      <section className="my-6 p-6 bg-white border border-primary/10 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-primary inline-block" />
          About the Event
        </h2>
        <p className="text-gray-600 leading-relaxed text-[15px]">
          {campaign.description || "No description provided."}
        </p>
      </section>

      {/* ── Comments ── */}
      <section className="my-6">
        <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-primary inline-block" />
          Comments
        </h2>

        <div className="flex flex-col gap-3">
          {allCommentsForCampaign?.length ? (
            allCommentsForCampaign.map((c) => (
              <div
                key={c._id}
                className="bg-white border border-primary/10 rounded-2xl shadow-sm p-4 transition hover:shadow-md"
                style={{ marginLeft: c.parentId ? "32px" : "0" }}
              >
                {/* Comment Author Row */}
                <div className="flex items-start gap-3">
                  <img
                    src={c.author?.profilePic || "http://placehold.co/40x40"}
                    className="w-9 h-9 rounded-full border-2 border-primary/20 flex-shrink-0 object-cover"
                    alt={c.author?.fullName}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {c.author?.fullName || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-400 flex-shrink-0">
                        {timeAgo(c.createdAt)}
                      </p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {c.comment}
                    </p>
                  </div>
                  {(user?.id === c.author?._id || isAdmin) && (
                    <button
                      onClick={() => deleteComment(c._id)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Replies */}
                {c.replies?.length > 0 && (
                  <div className="mt-3 ml-12 flex flex-col gap-2 border-l-2 border-primary/10 pl-3">
                    {c.replies.map((rpl) => (
                      <div key={rpl._id} className="flex items-start gap-2">
                        <img
                          src={
                            rpl.author?.profilePic?.url ||
                            "http://placehold.co/40x40"
                          }
                          className="w-7 h-7 rounded-full border border-primary/20 flex-shrink-0 object-cover"
                          alt={rpl.author?.fullName}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-xs text-gray-800">
                              {rpl.author?.fullName || "Unknown User"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {timeAgo(rpl.createdAt)}
                            </p>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {rpl.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Toggle */}
                {user && (
                  <button
                    className="mt-3 ml-12 text-xs text-primary font-medium hover:underline"
                    onClick={() =>
                      setReplyingTo(replyingTo?._id === c._id ? null : c)
                    }
                  >
                    {replyingTo?._id === c._id ? "Cancel" : "↩ Reply"}
                  </button>
                )}

                {/* Reply Input */}
                {replyingTo?._id === c._id && (
                  <div className="mt-3 ml-12 flex flex-col gap-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full border border-primary/20 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition"
                      rows={2}
                      placeholder="Write a reply..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await addComment(id, c.rating, replyText, c._id);
                          setReplyText("");
                          setReplyingTo(null);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition"
                      >
                        Post Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="px-4 py-1.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-white border border-primary/10 rounded-2xl text-gray-400 gap-2">
              <span className="text-3xl">💬</span>
              <p className="text-sm">No comments yet. Be the first!</p>
            </div>
          )}
        </div>

        {/* ── Add Comment Box ── */}
        <div className="relative mt-4 p-5 bg-white border border-primary/10 rounded-2xl shadow-sm">
          <CampaignCardRating
            campaignId={campaign?.id || campaign?.campaignId}
            user={user}
            volunteers={campaign.volunteers}
            myRating={campaign.ratings?.find(
              (r) => r.volunteer?.id === user?.id || r.volunteer === user?.id,
            )}
          />
          {!user && (
            <div className="absolute inset-0 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <Link
                state={{ from: location.pathname }}
                to="/login"
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium shadow hover:bg-primary/90 hover:-translate-y-px transition-all"
              >
                Login to comment
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Task List Modal ── */}
      {taskPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-primary">Task List</h2>
              <button
                onClick={() => openPopup(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            <hr className="my-3 border-primary/10" />

            <div className="max-h-80 flex flex-col gap-2 overflow-y-auto pr-1">
              {taskList?.length > 0 ? (
                taskList.map((vl) => (
                  <div
                    key={vl.id}
                    className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 hover:bg-primary/10 transition"
                  >
                    <span className="text-sm font-semibold text-gray-800 mr-auto">
                      {vl.title}
                    </span>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                      {vl.points} pts
                    </span>
                    {isVolunteer && (
                      <Link
                        to={`submit-task/${vl._id}`}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition"
                      >
                        Submit
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                  <span className="text-2xl">📋</span>
                  <p className="text-sm">No tasks found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaign;
