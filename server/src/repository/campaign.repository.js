import Campaign from "../models/campaign.model.js";
import { paginate } from "../utils/paginate.js";

export const createCampaign = async (data) => {
  const campaign = new Campaign(data);
  return await campaign.save();
};

export const getCampaignById = (id) => {
  return Campaign.findById(id)
    .populate("createdBy", "firstName lastName email")
    .populate({
      path: "volunteers.volunteer",
      select: "firstName lastName email profilePic skills",
    })
    .populate({
      path: "ratings.volunteer",
      select: "firstName lastName",
    });
};

export const updateCampaign = (id, updateData) => {
  return Campaign.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteCampaign = (id) => {
  return Campaign.findByIdAndDelete(id);
};

export const updateCampaignStatus = (id, status) => {
  return Campaign.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );
};

export const addCampaignAttachment = (id, attachment) => {
  return Campaign.findByIdAndUpdate(
    id,
    { $push: { attachments: attachment } },
    { new: true, runValidators: true },
  );
};

export const addCampaignVolunteer = (campaignId, volunteerRegId) => {
  return Campaign.findByIdAndUpdate(
    campaignId,
    {
      $addToSet: {
        volunteers: volunteerRegId,
      },
    },
    { new: true, runValidators: true },
  );
};

export const addCampaignRating = (campaignId, ratingData) => {
  return Campaign.findByIdAndUpdate(
    campaignId,
    { $push: { ratings: ratingData } },
    { new: true, runValidators: true },
  );
};
export const getCampaigns = async (filters = {}, options = {}) => {
  const { category, status, createdBy, location, search } = filters;
  const query = {};

  if (category) query.category = category;
  if (status) query.status = status;
  if (createdBy) query.createdBy = createdBy;
  if (location) query.location = { $regex: location, $options: "i" };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  return paginate({
    model: Campaign,
    query,
    page: options.page,
    limit: options.limit,
    select:
      "title location startDate endDate category status createdBy createdAt attachments volunteers",
    populate: [
      { path: "createdBy", select: "firstName lastName" },
      {
        path: "volunteers.volunteer",
        select: "firstName lastName email profilePic",
      },
    ],
  });
};

export const getCampaignWithVolunteerRequests = (id) => {
  return Campaign.findById(id).populate({
    path: "volunteers.volunteer",
    select: "firstName lastName email profilePic",
  });
};
