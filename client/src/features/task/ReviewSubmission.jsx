import {
  CheckCircle,
  Image as ImageIcon,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router"; // fixed import (assuming react-router-dom v6+)
import { toast } from "react-toastify";
import { api } from "../../axios/axios";

function ReviewSubmission() {
  const { taskId } = useParams();

  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [pointsAwarded, setPointsAwarded] = useState({});

  const fetchTaskSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/task/tasks/${taskId}/submissions`);

      if (res.data?.status !== "success") {
        throw new Error(res.data?.message || "Failed to fetch submissions");
      }

      setTaskSubmissions(res.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskSubmissions();
  }, [taskId]);

  const reviewTask = async (submissionId, status) => {
    const points = Number(pointsAwarded[submissionId]) || 0;

    if (status === "accepted" && points <= 0) {
      toast.warn("Please award at least 1 point before accepting");
      return;
    }

    try {
      setUpdatingId(submissionId);

      const res = await api.patch(
        `/task/tasks/submissions/${submissionId}/review`,
        {
          status,
          pointsAwarded: points,
        },
      );

      if (res.data?.status === "success") {
        toast.success(
          `Submission ${status === "accepted" ? "accepted" : "rejected"}`,
        );

        setTaskSubmissions((prev) =>
          prev.map((sub) =>
            sub._id === submissionId
              ? { ...sub, reviewStatus: status, pointsAwarded: points }
              : sub,
          ),
        );

        // Optional: clear input after successful review
        setPointsAwarded((prev) => {
          const copy = { ...prev };
          delete copy[submissionId];
          return copy;
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update review");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3 text-primary/70">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading submissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
          Review Task Submissions
        </h1>
        <p className="text-gray-600 text-base">
          Evaluate volunteer work, award points, and approve or reject
          submissions.
        </p>
      </div>

      {taskSubmissions.length === 0 ? (
        <div className="bg-white border border-primary/10 rounded-2xl p-10 text-center">
          <p className="text-gray-500 text-lg font-medium">
            No submissions received yet.
          </p>
          <p className="text-gray-400 mt-2">
            Check back later or verify the task is active.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {taskSubmissions.map((submission) => {
            const isUpdating = updatingId === submission._id;
            const hasBeenReviewed = !!submission.reviewStatus;
            const isAccepted = submission.reviewStatus === "accepted";

            return (
              <div
                key={submission._id}
                className={`
                  bg-white rounded-2xl border
                  ${
                    hasBeenReviewed
                      ? isAccepted
                        ? "border-green-200 bg-green-50/30"
                        : "border-red-200 bg-red-50/20"
                      : "border-primary/15 hover:border-primary/30"
                  }
                  shadow-sm hover:shadow-md transition-all duration-300
                  flex flex-col overflow-hidden
                `}
              >
                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Volunteer Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-800 text-lg leading-tight">
                      {submission.volunteer?.fullName || "Anonymous Volunteer"}
                    </h3>
                    <p className="text-xs text-gray-500 tracking-tight">
                      {submission.volunteer?.email || "—"}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                    {submission.summary || "No summary provided."}
                  </div>

                  {/* Proof Images */}
                  {submission.proof?.length > 0 ? (
                    <div className="flex flex-wrap gap-2.5 mt-1">
                      {submission.proof.map((img, index) => (
                        <div
                          key={index}
                          className="group relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
                          title="Click to enlarge"
                        >
                          <img
                            src={img.url}
                            alt={`Proof ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic">
                      No proof images provided.
                    </div>
                  )}

                  {/* Points */}
                  <div className="mt-2 space-y-1.5">
                    <label
                      htmlFor={`points-${submission._id}`}
                      className="text-xs font-medium text-gray-600"
                    >
                      Points to Award
                    </label>
                    <input
                      id={`points-${submission._id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={
                        pointsAwarded[submission._id] ??
                        submission.pointsAwarded ??
                        ""
                      }
                      onChange={(e) =>
                        setPointsAwarded((prev) => ({
                          ...prev,
                          [submission._id]: e.target.value,
                        }))
                      }
                      disabled={hasBeenReviewed || isUpdating}
                      className={`
                        w-full px-3 py-2 text-sm border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40
                        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                      `}
                      placeholder="0 — 100"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto pt-4">
                    <button
                      onClick={() => reviewTask(submission._id, "accepted")}
                      disabled={isUpdating || hasBeenReviewed}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm
                        transition-all active:scale-[0.98]
                        ${
                          hasBeenReviewed
                            ? isAccepted
                              ? "bg-green-600 text-white cursor-default"
                              : "bg-gray-300 text-gray-600 cursor-default"
                            : "bg-primary hover:bg-primary/90 text-white shadow-sm"
                        }
                        disabled:opacity-60 disabled:hover:bg-primary disabled:cursor-not-allowed
                      `}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isAccepted ? (
                        <CheckCircle size={16} />
                      ) : null}
                      {hasBeenReviewed
                        ? isAccepted
                          ? "Accepted"
                          : "—"
                        : "Accept"}
                    </button>

                    <button
                      onClick={() => reviewTask(submission._id, "rejected")}
                      disabled={isUpdating || hasBeenReviewed}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm
                        transition-all active:scale-[0.98]
                        ${
                          hasBeenReviewed
                            ? !isAccepted
                              ? "bg-red-600 text-white cursor-default"
                              : "bg-gray-300 text-gray-600 cursor-default"
                            : "border border-red-400 text-red-600 hover:bg-red-50"
                        }
                        disabled:opacity-60 disabled:hover:bg-transparent disabled:cursor-not-allowed
                      `}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : !isAccepted && hasBeenReviewed ? (
                        <XCircle size={16} />
                      ) : null}
                      {hasBeenReviewed
                        ? !isAccepted
                          ? "Rejected"
                          : "—"
                        : "Reject"}
                    </button>
                  </div>

                  {/* Current Status */}
                  {hasBeenReviewed && (
                    <p className="text-xs text-center mt-2 font-medium">
                      <span
                        className={
                          isAccepted ? "text-green-700" : "text-red-700"
                        }
                      >
                        {isAccepted ? "Accepted" : "Rejected"}
                      </span>
                      {submission.pointsAwarded > 0 && (
                        <span className="ml-1.5 text-gray-600">
                          • {submission.pointsAwarded} pts
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReviewSubmission;
