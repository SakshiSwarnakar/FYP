import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    points: {
      type: Number,
      default: 0,
    },

    attachments: {
      type: [
        {
          url: { type: String },
          public_id: { type: String },
          type: { type: String },
        },
      ],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
