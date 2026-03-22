import Campaign from "../models/campaign.model.js";
import taskSubmissionModel from "../models/taskSubmission.model.js";
import userModel from "../models/user.model.js";

export const LEVELS = [
  { name: "Novice", minPoints: 0 },
  { name: "Apprentice", minPoints: 20 },
  { name: "Contributor", minPoints: 50 },
  { name: "Achiever", minPoints: 100 },
  { name: "Champion", minPoints: 200 },
];

export const calculateVolunteerPoints = async (volunteerId) => {
  let points = 0;

  const attendedCampaigns = await Campaign.countDocuments({
    volunteers: {
      $elemMatch: {
        volunteer: volunteerId,
        attendanceStatus: "present",
      },
    },
  });
  points += attendedCampaigns;

  const acceptedTasks = await taskSubmissionModel.countDocuments({
    volunteer: volunteerId,
    status: "accepted",
  });
  points += acceptedTasks * 5;

  const completedCampaigns = await Campaign.countDocuments({
    volunteers: {
      $elemMatch: {
        volunteer: volunteerId,
        status: "accepted",
        attendanceStatus: "present",
      },
    },
    endDate: { $lte: new Date() },
  });
  points += completedCampaigns * 10;

  const ratedCampaigns = await Campaign.countDocuments({
    "ratings.volunteer": volunteerId,
  });
  points += ratedCampaigns;

  return points;
};

export const updateVolunteerLevelAndBadge = async (volunteerId) => {
  const user = await userModel.findById(volunteerId);
  if (!user) return;

  const points = await calculateVolunteerPoints(volunteerId);

  const level = LEVELS.slice()
    .reverse()
    .find((lvl) => points >= lvl.minPoints);

  if (!level) return;

  user.level = level.name;

  const existingBadge = user.badges.find((b) => b.name === level.name);
  if (!existingBadge) {
    user.badges.push({ name: level.name, earnedAt: new Date() });
  }

  await user.save();
  return { points, level: level.name };
};
