import { HTTP_STATUS } from "../constants/http.js";
import taskSubmissionModel from "../models/taskSubmission.model.js";
import userModel from "../models/user.model.js";
import { getCampaignById } from "../repository/campaign.repository.js";
import {
  createTask as createTaskRepo,
  createTaskSubmission as createTaskSubmissionRepo,
  getSubmissionById,
  getTaskById,
  getTasksByCampaign as getTasksByCampaignRepo,
  getTaskSubmissions as getTaskSubmissionsRepo,
} from "../repository/task.repository.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { getCampaignPhase } from "../utils/campaignPhase.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { updateVolunteerLevelAndBadge } from "../utils/volunteerLevel.js";
import { notifyTaskSubmissionReviewed } from "./notification.service.js";

export const createTaskService = async (campaignId, userId, data) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");
  assertOrThrow(
    campaign.createdBy._id.toString() === userId.toString(),
    HTTP_STATUS.FORBIDDEN,
    "Only organizer can create tasks",
  );

  const phase = getCampaignPhase(campaign);
  assertOrThrow(
    phase !== "COMPLETED",
    HTTP_STATUS.BAD_REQUEST,
    "Cannot add tasks to completed campaigns",
  );

  const taskData = { ...data, campaign: campaignId };
  const task = await createTaskRepo(taskData);

  return task;
};

export const getTasksByCampaignService = async (campaignId, userId, role) => {
  const campaign = await getCampaignById(campaignId);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const phase = getCampaignPhase(campaign);

  let acceptedVolunteer = null;
  if (role === "VOLUNTEER") {
    acceptedVolunteer = campaign.volunteers.find(
      (v) =>
        v.volunteer._id.toString() === userId.toString() &&
        v.status === "accepted",
    );
    assertOrThrow(
      acceptedVolunteer,
      HTTP_STATUS.FORBIDDEN,
      "You are not accepted for this campaign",
    );
  }

  const tasks = await getTasksByCampaignRepo(campaignId);

  if (role === "VOLUNTEER") {
    const submissions = await taskSubmissionModel
      .find({
        task: { $in: tasks.map((t) => t._id) },
        volunteer: userId,
      })
      .lean();

    const submissionsMap = {};
    submissions.forEach((s) => (submissionsMap[s.task.toString()] = s.status));

    tasks.forEach((t) => {
      t.mySubmissionStatus = submissionsMap[t._id.toString()] || null;
    });
  }

  return tasks;
};

export const submitTaskService = async (
  taskId,
  volunteerId,
  summary,
  proofFiles,
) => {
  const task = await getTaskById(taskId);
  assertOrThrow(task, HTTP_STATUS.NOT_FOUND, "Task not found");

  const campaign = await getCampaignById(task.campaign);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");

  const phase = getCampaignPhase(campaign);
  assertOrThrow(
    phase === "ONGOING",
    HTTP_STATUS.BAD_REQUEST,
    "Tasks can only be submitted during ongoing campaigns",
  );

  const volunteer = campaign.volunteers.find(
    (v) =>
      v.volunteer._id.toString() === volunteerId.toString() &&
      v.status === "accepted",
  );
  assertOrThrow(
    volunteer,
    HTTP_STATUS.FORBIDDEN,
    "You are not accepted for this campaign",
  );

  const existing = await taskSubmissionModel.findOne({
    task: taskId,
    volunteer: volunteerId,
  });
  assertOrThrow(
    !existing,
    HTTP_STATUS.BAD_REQUEST,
    "You have already submitted this task",
  );

  let proof = [];
  if (proofFiles.length > 0) {
    const uploadPromises = proofFiles.map(async (file) => {
      const uploaded = await uploadToCloudinary(file.buffer, "task_proofs");
      return {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        type: uploaded.resource_type,
      };
    });

    proof = await Promise.all(uploadPromises);
  }

  const submission = await createTaskSubmissionRepo({
    task: taskId,
    volunteer: volunteerId,
    summary,
    proof,
  });

  return submission;
};

export const getTaskSubmissionsService = async (taskId, organizerId) => {
  const task = await getTaskById(taskId);
  assertOrThrow(task, HTTP_STATUS.NOT_FOUND, "Task not found");

  const campaign = await getCampaignById(task.campaign);
  assertOrThrow(campaign, HTTP_STATUS.NOT_FOUND, "Campaign not found");
  assertOrThrow(
    campaign.createdBy._id.toString() === organizerId.toString(),
    HTTP_STATUS.FORBIDDEN,
    "Only organizer can view submissions",
  );

  const submissions = await getTaskSubmissionsRepo(taskId);
  return submissions;
};

export const reviewTaskSubmissionService = async (
  submissionId,
  organizerId,
  status,
) => {
  assertOrThrow(
    ["accepted", "rejected"].includes(status),
    HTTP_STATUS.BAD_REQUEST,
    "Invalid status",
  );

  const submission = await getSubmissionById(submissionId);
  assertOrThrow(submission, HTTP_STATUS.NOT_FOUND, "Submission not found");

  const campaign = await getCampaignById(submission.task.campaign);
  const createdByUser = campaign.createdBy;
  assertOrThrow(
    createdByUser._id.toString() === organizerId.toString(),
    HTTP_STATUS.FORBIDDEN,
    "Not authorized",
  );

  submission.status = status;
  submission.reviewedBy = organizerId;
  submission.reviewedAt = new Date();

  await submission.save();
  await notifyTaskSubmissionReviewed({
    sender: organizerId,
    recipient: submission.volunteer,
    campaign,
    task: submission.task,
    status,
  });

  if (status === "accepted") {
    const user = await userModel.findById(submission.volunteer);

    const existingBadge = user.badges.find(
      (b) => b.name === `Task Completed: ${submission.task.title}`,
    );
    if (!existingBadge) {
      user.badges.push({
        name: `Task Completed: ${submission.task.title}`,
        earnedAt: new Date(),
      });
      await user.save();
      await updateVolunteerLevelAndBadge(submission.volunteer);
    }
  }

  return submission;
};
