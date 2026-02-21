import Task from "../models/task.model.js";
import TaskSubmission from "../models/taskSubmission.model.js";

export const createTask = (data) => new Task(data).save();

export const getTasksByCampaign = (campaignId) => {
  return Task.find({ campaign: campaignId }).lean();
};

export const getTaskById = (taskId) => {
  return Task.findById(taskId);
};

export const createTaskSubmission = (data) => new TaskSubmission(data).save();

export const getTaskSubmissions = (taskId) => {
  return TaskSubmission.find({ task: taskId })
    .populate("volunteer", "firstName lastName email profilePic")
    .populate("reviewedBy", "firstName lastName email");
};

export const getSubmissionById = (submissionId) => {
  return TaskSubmission.findById(submissionId);
};

export const updateTaskSubmission = (submissionId, updateData) => {
  return TaskSubmission.findByIdAndUpdate(submissionId, updateData, {
    new: true,
    runValidators: true,
  });
};
