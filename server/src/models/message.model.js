import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      trim: true,
      default: null,
    },

    attachment: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
      type: { type: String, default: null },
      originalName: { type: String, default: null },
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

messageSchema.pre("validate", function () {
  if (!this.text && !this.attachment?.url) {
    this.invalidate("text", "Message must have text or an attachment");
  }
});

export default mongoose.model("Message", messageSchema);
