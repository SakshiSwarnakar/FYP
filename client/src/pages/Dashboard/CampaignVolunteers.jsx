import { Link, Outlet, useParams } from "react-router";
import { useCampaign } from "../../context/CampaignContext";
import { Check, X } from "lucide-react";
import { useState } from "react";

const CampaignVolunteers = () => {
  const [volunteerStatus, setVolunteerStatus] = useState([])
  const { id } = useParams();


  const { campaigns, handleVolunteerAttendance } = useCampaign();

  const handleAttendence = async (campaignId, status, volunteerId) => {
    const res = await handleVolunteerAttendance(campaignId, status, volunteerId)
    setVolunteerStatus(prev => ([...prev, res]))
  }


  if (id) {
    return <Outlet />;
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">
          Volunteers Attendence
        </h1>
        <p className="text-sm text-gray-500 max-w-xl">
          View and change the attendence of the volunteers.
        </p>
      </div>

      {/* Campaign Cards */}
      <div className="flex flex-wrap gap-6">
        {campaigns.map((campaign) => {
          // const acceptedVolunteers = campaign.volunteers?.filter(
          //   (v) => v.status === "accepted"
          // )
          return (
            <div
              key={campaign.id}
              className="basis-64 grow max-w-72 rounded-xl border border-primary/20 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              {/* Campaign Title */}
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-primary truncate">
                    {campaign.title}
                  </h4>
                  <p className="text-xs bg-primary/10 text-accent px-2 py-1 rounded-full">{campaign?.phase}</p>
                </div>
                <div className="flex text-gray-500 text-xs gap-4 justify-start">
                  <p>{campaign.category}</p>
                  <p>{campaign.location}</p>
                  <p>{campaign.startDate?.split("T")[0]}</p>
                </div>
              </div>

              {/* Volunteers */}
              <div className="flex flex-col max-h-56 overflow-y-auto">
                {campaign.volunteers?.length ? (
                  campaign?.volunteers.map((el, index) => (
                    <div
                      key={el.volunteer._id}
                      className="group flex items-center justify-between duration-150 hover:px-3 py-2 text-sm rounded text-gray-700 transition-all hover:bg-primary/5 hover:text-primary"
                    >
                      <Link to='/'>
                        {el.volunteer.firstName} {el.volunteer.lastName}
                      </Link>

                      {el.attendanceStatus == 'present' && <span>Present</span>}

                      {el.attendanceStatus == 'absent' && <span>Absent</span>}

                      {!el?.attendanceStatus && <div className="flex gap-1 text-white">
                        <button onClick={() => handleAttendence(campaign.id,
                          "present",
                          el.volunteer._id)}
                          title="Present" className="bg-green-400 rounded-full p-1" ><Check size={12} /></button>

                        <button onClick={() =>
                          handleAttendence(
                            campaign.id,
                            "absent",
                            el.volunteer._id
                          )
                        } title="absent" className="bg-red-400 rounded-full p-1"><X size={12} /></button>

                      </div>}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-accent/60 italic">
                    No accepted volunteers
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignVolunteers;
