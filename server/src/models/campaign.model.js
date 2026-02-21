import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Health", "Education", "Environment", "Social Work"],
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },

    attachments: {
      type: [
        {
          url: { type: String, required: true },
          public_id: { type: String, required: true },
          type: { type: String, required: true },
        },
      ],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    volunteers: [
      {
        volunteer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        attendanceStatus: {
          type: String,
          enum: ["present", "absent"],
          default: null,
        },
        attendanceMarkedAt: {
          type: Date,
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        respondedAt: {
          type: Date,
        },
      },
    ],

    ratings: [
      {
        volunteer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Campaign", campaignSchema);
