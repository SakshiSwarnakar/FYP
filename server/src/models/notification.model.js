import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "VOLUNTEER_APPLIED",
        "APPLICATION_ACCEPTED",
        "APPLICATION_REJECTED",
        "TASK_SUBMISSION_REVIEWED",
        "RATING_SUBMITTED",
        "COMMENT_RECEIVED",
        "MENTION_IN_COMMENT",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    redirectLink: {
      type: String,
      default: null,
    },

    metadata: {
      campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        default: null,
      },
      ratingId: { type: mongoose.Schema.Types.ObjectId, default: null },
      commentId: { type: mongoose.Schema.Types.ObjectId, default: null },
      taskId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
