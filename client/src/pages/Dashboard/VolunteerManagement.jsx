import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";
import Loading from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import { useCampaign } from "../../context/CampaignContext";

function VolunteerManagement() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const {
    campaigns,
    handleVolunteerAttendance,
    handlePagination,
    fetchCampaigns,
  } = useCampaign();
  const pagination = campaigns?.pagination?.totalPages;
  const currentPage = Number(campaigns?.pagination?.page);
  const totalPages = campaigns?.pagination?.totalPages;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
  }, [authLoading, user?.id, navigate]);

  const handleAttendence = async (campaignId, status, volunteerId) => {
    await handleVolunteerAttendance(campaignId, status, volunteerId);
  };

  const handleRespond = async (campaignId, volunteerIdParam, status) => {
    try {
      const res = await api.patch(
        `/campaign/${campaignId}/volunteer-requests/${volunteerIdParam}`,
        { status },
      );
      console.log(res);
      if (res.status == "success") {
        toast.success(`Request ${status}`);
        fetchCampaigns({ createdBy: user?.id });
      }
    } catch (err) {
      toast.error(err?.message ?? "Failed to update request");
    }
  };

  if (authLoading) {
    return <Loading />;
  }
  const StatusBadge = ({ label, color }) => {
    const styles = {
      green: "bg-emerald-50 text-emerald-600 border-emerald-200",
      red: "bg-red-50 text-red-500 border-red-200",
      gray: "bg-gray-100 text-gray-400 border-gray-200",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${styles[color]}`}
      >
        {label}
      </span>
    );
  };
  return (
    <div className="flex-1 px-1">
      {/* ── Header ── */}
      <div className="mb-10">
        <h1 className="font-bold text-primary text-5xl tracking-tight leading-tight">
          Volunteer Management
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Manage volunteers across your different campaigns.
        </p>
        <div className="mt-4 w-12 h-1 rounded-full bg-primary/40" />
      </div>

      {/* ── Campaign Sections ── */}
      <div className="space-y-6">
        {campaigns?.campaigns?.map((campaign, index) => (
          <section
            key={index}
            className="rounded-2xl border border-primary/15 bg-white shadow-sm overflow-hidden transition hover:shadow-md"
          >
            {/* Campaign Header */}
            <div className="px-5 py-4 border-b border-primary/10 bg-primary/4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="font-bold text-lg text-primary leading-tight">
                    {campaign.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-400">
                    {campaign.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {campaign.location}
                      </span>
                    )}
                    {campaign.startDate && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} />
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-medium bg-primary/8 text-primary border border-primary/15 rounded-full px-3 py-1">
                  {campaign?.volunteers?.length || 0} volunteer
                  {campaign?.volunteers?.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Volunteer List */}
            {campaign?.volunteers?.length ? (
              <ul className="divide-y divide-primary/8">
                {campaign.volunteers.map((request, i) => (
                  <li
                    key={i}
                    className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary/3 transition-colors"
                  >
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                        <User size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">
                          {request.volunteer.firstName}
                        </p>
                        {request.volunteer?.email && (
                          <p className="text-xs text-gray-400 truncate">
                            {request.volunteer.email}
                          </p>
                        )}
                        <p className="text-xs text-gray-300 mt-0.5">
                          Applied {request.appliedAt.split("T")[0]}
                        </p>
                      </div>
                    </div>

                    {/* Actions / Status */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Pending */}
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleRespond(
                                campaign.id,
                                request.volunteer._id,
                                "accepted",
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 hover:-translate-y-px transition-all shadow-sm"
                          >
                            <CheckCircle2 size={14} /> Accept
                          </button>
                          <button
                            onClick={() =>
                              handleRespond(
                                campaign.id,
                                request.volunteer._id,
                                "rejected",
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 text-red-500 bg-red-50 text-xs font-semibold hover:bg-red-100 hover:-translate-y-px transition-all"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}

                      {/* Accepted — mark attendance */}
                      {request.status === "accepted" &&
                        !request.attendanceStatus && (
                          <>
                            <button
                              onClick={() =>
                                handleAttendence(
                                  campaign.id,
                                  "present",
                                  request.volunteer._id,
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 hover:-translate-y-px transition-all shadow-sm"
                            >
                              <CheckCircle2 size={14} /> Present
                            </button>
                            <button
                              onClick={() =>
                                handleAttendence(
                                  campaign.id,
                                  "absent",
                                  request.volunteer._id,
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-500 bg-gray-50 text-xs font-semibold hover:bg-gray-100 hover:-translate-y-px transition-all"
                            >
                              <XCircle size={14} /> Absent
                            </button>
                          </>
                        )}

                      {/* Attendance locked */}
                      {request.status === "accepted" &&
                        request.attendanceStatus === "present" && (
                          <StatusBadge label="✓ Present" color="green" />
                        )}
                      {request.status === "accepted" &&
                        request.attendanceStatus === "absent" && (
                          <StatusBadge label="✗ Absent" color="gray" />
                        )}
                      {request.status === "rejected" && (
                        <StatusBadge label="Rejected" color="red" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-300 gap-2">
                <User size={28} />
                <p className="text-sm">No volunteers yet.</p>
              </div>
            )}
          </section>
        ))}

        {/* ── Pagination ── */}
        {totalPages > 0 && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePagination(currentPage - 1)}
                disabled={!campaigns.pagination.hasPrevPage}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-primary/20 text-primary bg-white hover:bg-primary/5 hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: pagination }, (_, i) => {
                const page = i + 1;
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => !isActive && handlePagination(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all shadow-sm ${
                      isActive
                        ? "bg-primary text-white shadow-primary/20 shadow-md scale-105 cursor-default"
                        : "border border-primary/20 text-primary bg-white hover:bg-primary/5 hover:-translate-y-px"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePagination(currentPage + 1)}
                disabled={!campaigns.pagination.hasNextPage}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-primary/20 text-primary bg-white hover:bg-primary/5 hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {totalPages > 1 && (
              <p className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VolunteerManagement;
