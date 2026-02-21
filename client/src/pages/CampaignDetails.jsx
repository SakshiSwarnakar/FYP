import { Bookmark, MapPin, Plus, TableOfContents, Timer, UsersRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../axios/axios";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { useCampaign } from "../context/CampaignContext";

function Campaign() {
  const { user } = useAuth();
  const { id } = useParams();
  const location = useLocation();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskPop, openPopup] = useState(false);
  const [taskList, setTaskList] = useState()

  const isAdmin = useMemo(() => user?.role === "ADMIN", [user])
  const isVolunteer = useMemo(() => user?.role === 'VOLUNTEER', [user])

  const loadTask = async () => {
    const res = await api.get(`/task/campaigns/${id}/tasks`)
    if (res.status == 'error') {
      toast.error(res.error.message)
      return;
    }
    setTaskList(res.data)
  }

  const loadCampaign = async () => {
    try {
      const res = await api.get(`/campaign/${id}`);
      if (res.status == 'success')
        setCampaign(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Campaign ================= */

  useEffect(() => {
    loadCampaign()
  }, [id])

  useEffect(() => {
    if (taskPop) {
      loadTask()
      return
    }

  }, [taskPop]);

  /* ================= Volunteers (ADMIN only) ================= */



  const addComment = async () => {
    try {
      const res = await api.get("");
    } catch (error) { }
  };

  if (loading) return <Loading />;

  if (!campaign) return null;

  return (
    <div className=" container mx-auto">
      {campaign?.attachments && (
        <img
          loading="lazy"
          className="h-120 w-full object-cover mb-10 rounded"
          src={
            campaign?.attachments?.[0]?.url || "https://placehold.co/1400x620"
          }
          alt="campaign"
        />
      )}

      {/* ================= Event Header ================= */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between gap-5">
            <h1 className="text-primary text-4xl mr-auto font-bold mb-2">
              {campaign.title}
            </h1>
            {isAdmin && (
              <Link className="primary-btn" to='create-task'><Plus size={16} />Create Task</Link>
            )}

            {(isVolunteer || isAdmin) && <button
              onClick={() => openPopup(true)}
              className="primary-btn md:space-x-2"
            >
              <TableOfContents size={16} />
              <span className="hidden md:inline">View Task</span>
            </button>}
            {/* ================= Tasks popup (ADMIN) ================= */}
            {taskPop && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                {/* Modal */}
                <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6 animate-fadeIn">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-primary">
                      Task List
                    </h2>

                    <button
                      onClick={() => openPopup(false)}
                      className="p-1 rounded-md hover:bg-white/10 transition"
                    >
                      <X className=" hover:text-red-500" />
                    </button>
                  </div>

                  <hr className="my-4 border-black/10" />

                  {/* Content */}
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {taskList?.length > 0 ? (
                      taskList.map((vl) => (
                        <div
                          key={vl.id}
                          className={`bg-primary/10 flex gap-6 items-center rounded-lg px-4 py-2 hover:bg-primary/20 transition duration-150`}
                        >
                          <span className="text-black font-semibold mr-auto">
                            {vl.title}
                          </span>
                          <span className="text-sm text-gray-500">{vl.points}</span>
                          {isVolunteer && <Link to={`submit-task/${vl.id}`} className="primary-btn">Submit</Link>}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-black/60">
                        No task found.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 flex gap-2 text-gray-500">
        <p className="bg-secondary rounded px-1 flex items-center gap-1">
          <Bookmark size={18} />
          <span>{campaign.category}</span>
        </p>
        <p className="bg-secondary rounded px-1 flex items-center gap-1">
          <Timer size={18} />
          <span>{campaign?.date?.split("T")[0]}</span>
        </p>
        <p className="bg-secondary rounded px-1 flex items-center gap-1">
          <MapPin size={18} />
          <span>{campaign.location}</span>
        </p>
      </div>

      <div className="my-5">
        <h2 className="text-2xl font-semibold text-primary mb-3">
          About the Event
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {campaign.description || "No description provided."}
        </p>
      </div>

      <div className="my-5">
        <h2 className="text-2xl font-semibold text-primary mb-4">Comments</h2>

        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent">
          {campaign?.comments?.length ? (
            campaign.comments.map((c, index) => (
              <div
                key={index}
                className="min-w-[280px] bg-white border border-border p-4 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={c.user?.avatar || "/placeholder.png"}
                    className="w-10 h-10 rounded-full border"
                    alt="avatar"
                  />
                  <div>
                    <p className="font-semibold">
                      {c.user?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {c.createdAt?.slice(0, 10)}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {c.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* ================= Add Comment ================= */}
        <div className="relative mt-6 p-4 bg-white border border-border rounded-2xl shadow-sm">
          <form onSubmit={addComment} className={!user ? "blur-sm" : ""}>
            <textarea
              placeholder="Write your comment..."
              className="w-full border border-border rounded-xl p-3 outline-none focus:border-primary transition-all"
              rows="3"
            />
            <button
              type="submit"
              disabled={!user}
              className="mt-3 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-all"
            >
              Post Comment
            </button>
          </form>

          {!user && (
            <Link
              state={{ from: location.pathname }}
              to="/login"
              className="absolute -translate-1/2 top-1/2 left-1/2 primary-btn w-fit"
            >
              Login to comment.
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Campaign;
