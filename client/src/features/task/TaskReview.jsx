import { BadgeCheck, Clock, Paperclip, Star, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";

function TaskReviewPage() {
  const { campaignId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/task/campaigns/${campaignId}/tasks`);
      if (res.status === "success") {
        setTasks(res.data);
      } else {
        toast.error(res.message || "Failed to fetch tasks");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [campaignId]);

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;
  const statusConfig = {
    approved: {
      label: "Approved",
      icon: <BadgeCheck size={12} />,
      className: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    pending: {
      label: "Pending",
      icon: <Clock size={12} />,
      className: "bg-amber-50 text-amber-500 border-amber-200",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle size={12} />,
      className: "bg-red-50 text-red-500 border-red-200",
    },
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* ── Header ── */}
      <div>
        <h2 className="text-5xl font-bold text-primary tracking-tight leading-tight">
          Task Review
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">
          Review and manage tasks submitted for this campaign.
        </p>
        <div className="mt-4 w-12 h-1 rounded-full bg-primary/40" />
      </div>

      {/* ── Empty State ── */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-primary/10 bg-white text-gray-300 gap-3">
          <BadgeCheck size={36} />
          <p className="text-sm font-medium">No tasks submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => {
            const status = statusConfig[task.status] || null;

            return (
              <div
                key={task._id}
                className="bg-white rounded-2xl border border-primary/12 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Card Top Accent */}
                <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary/60 to-primary/30" />

                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Title + Points */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-primary leading-tight truncate flex-1">
                      {task.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-primary/8 text-primary border border-primary/15 rounded-full flex-shrink-0">
                      <Star size={10} />
                      {task.points} pts
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {task.description}
                  </p>

                  {/* Attachments */}
                  {task.attachments?.length > 0 && (
                    <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto mt-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                        <Paperclip size={11} /> Attachments
                      </span>

                      {task.attachments.map((file, idx) => (
                        <a
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline truncate"
                        >
                          <Paperclip size={11} className="flex-shrink-0" />
                          {file.type ? `${file.type} ` : ""}Attachment {idx + 1}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Status Badge */}
                  {status && (
                    <span
                      className={`inline-flex items-center gap-1.5 self-start text-xs font-semibold px-2.5 py-1 rounded-full border ${status.className}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  )}

                  {/* Footer */}
                  <div className="pt-3 border-t border-primary/8">
                    <Link
                      to={`../task/${task._id}`}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                        updatingId === task._id
                          ? "bg-primary/40 text-white cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-px shadow-sm"
                      }`}
                    >
                      View Task
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TaskReviewPage;
