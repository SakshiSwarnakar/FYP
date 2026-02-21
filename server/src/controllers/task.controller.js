import {
  createTaskService,
  getTasksByCampaignService,
  getTaskSubmissionsService,
  reviewTaskSubmissionService,
  submitTaskService,
} from "../services/task.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const createTask = asyncHandler(async (req, res) => {
  const campaignId = req.params.campaignId;
  const userId = req.user.id;
  const data = req.body;

  const task = await createTaskService(campaignId, userId, data);
  return success(res, "Task created successfully", task);
});

export const getTasksByCampaign = asyncHandler(async (req, res) => {
  const campaignId = req.params.campaignId;
  const tasks = await getTasksByCampaignService(
    campaignId,
    req.user?.id,
    req.user?.role,
  );
  return success(res, "Tasks fetched successfully", tasks);
});

export const submitTask = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const volunteerId = req.user.id;
  const { summary, proof } = req.body;

  const submission = await submitTaskService(
    taskId,
    volunteerId,
    summary,
    proof,
  );
  return success(res, "Task submitted successfully", submission);
});

export const getTaskSubmissions = asyncHandler(async (req, res) => {
  const taskId = req.params.taskId;
  const submissions = await getTaskSubmissionsService(taskId, req.user.id);
  return success(res, "Task submissions fetched successfully", submissions);
});

export const reviewTaskSubmission = asyncHandler(async (req, res) => {
  const submissionId = req.params.submissionId;
  const { status, pointsAwarded } = req.body;

  const submission = await reviewTaskSubmissionService(
    submissionId,
    req.user.id,
    status,
    pointsAwarded,
  );
  return success(res, `Task submission ${status}`, submission);
});
