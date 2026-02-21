import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { api } from "../../axios/axios";
import { useAuth } from "../../context/AuthContext";
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  User,
  XCircle,
} from "lucide-react";
import { useCampaign } from "../../context/CampaignContext";
import Loading from "../../components/Loading";

function VolunteerManagement() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const { campaigns, handleVolunteerAttendance, fetchCampaigns } = useCampaign()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
  }, [authLoading, user?.id, navigate]);

  const handleAttendence = async (campaignId, status, volunteerId) => {
    await handleVolunteerAttendance(campaignId, status, volunteerId)
  }

  const handleRespond = async (campaignId, volunteerIdParam, status) => {
    try {
      const res = await api.patch(
        `/campaign/${campaignId}/volunteer-requests/${volunteerIdParam}`,
        { status }
      );
      if (res.status == 'success') {
        toast.success(`Request ${status}`);
        fetchCampaigns({ createdBy: user?.id })
      }
    } catch (err) {
      toast.error(err?.message ?? "Failed to update request");
    }
  };

  if (authLoading) {
    return <Loading />
  }


  return (
    <>
      <div className="flex-1">
        <h1 className="font-bold text-primary mb-2 text-5xl">
          Volunteer Management
        </h1>
        <p className="text-accent/80 mb-8">
          Manage volunteers across your different campaign.
        </p>


        <div className="space-y-8">
          {campaigns?.map(
            (campaign, index) => (
              <section
                key={index}
                className="rounded-xl border border-primary/20 bg-white/50 shadow-sm overflow-hidden"
              >
                <div className="p-4 md:p-5 border-b border-primary/10 bg-primary/5">
                  <h2 className="font-bold text-xl text-accent">
                    {campaign.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-accent/80">
                    {campaign.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {campaign.location}
                      </span>
                    )}
                    {campaign.startDate && (
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {campaign.volunteers.length ? <ul className="divide-y divide-primary/10">

                  {campaign.volunteers.map((request, index) => (
                    <li
                      key={index}
                      className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <User size={20} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-accent truncate">
                            {request.volunteer.firstName}
                          </p>
                          {request.volunteer?.email && (
                            <p className="text-sm text-accent/70 truncate">
                              {request.volunteer.email}
                            </p>
                          )}
                          <p className="text-xs text-accent/60 mt-0.5">
                            Applied {request.appliedAt.split("T")[0]}
                          </p>
                        </div>
                      </div>

                      {request.status == 'pending' &&
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() =>
                              handleRespond(
                                campaign.id,
                                request.volunteer._id,
                                "accepted"
                              )
                            }
                            className="primary-btn"
                          >
                            <CheckCircle2 size={18} />
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleRespond(
                                campaign.id,
                                request.volunteer._id,
                                "rejected"
                              )
                            }
                            className="secondary-btn"
                          >
                            <XCircle size={18} />
                            Reject
                          </button>
                        </div>}
                      {(request.status == 'accepted' && !request.attendanceStatus) &&
                        < div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() =>
                              handleAttendence(campaign.id,
                                "present",
                                request.volunteer._id)
                            }
                            className="primary-btn"
                          >
                            <CheckCircle2 size={18} />
                            Present
                          </button>
                          <button
                            onClick={() =>
                              handleAttendence(campaign.id,
                                "absent",
                                request.volunteer._id)
                            }
                            className="secondary-btn"
                          >
                            <XCircle size={18} />
                            Absent
                          </button>
                        </div>
                      }
                      {
                        request.status == "accepted" && request.attendanceStatus == 'present' &&
                        <button className="secondary-btn" disabled>
                          Present
                        </button>
                      }
                      {
                        request.status == "accepted" && request.attendanceStatus == 'absent' &&
                        <button className="secondary-btn" disabled>
                          Absent
                        </button>
                      }
                      {
                        request.status == "rejected" &&
                        <button className="secondary-btn" disabled>
                          Rejected
                        </button>
                      }
                    </li>
                  ))}
                </ul> : <p className="p-4 text-primary/60">No volunteers found.</p>}
              </section>
            )
          )}
        </div>
      </div >
    </>
  );
}

export default VolunteerManagement;
