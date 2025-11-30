import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^[+]?[0-9\s()-]{7,20}$/, "Invalid phone format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["ADMIN", "VOLUNTEER"],
      default: "VOLUNTEER",
    },

    // ORGANIZATION FIELDS
    organizationName: { type: String, default: null },
    organizationDescription: { type: String, default: null },

    organizationType: {
      type: String,
      enum: ["NGO", "Charity", "Club", "Community", "Other", null],
      default: null,
    },

    organizationLogo: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },

    organizationPhone: { type: String, default: null },
    organizationEmail: { type: String, default: null },

    organizationLocation: {
      address: String,
      city: String,
      state: String,
      country: String,
    },

    profilePic: {
      url: { type: String, default: null },
      public_id: { type: String, default: null },
    },

    skills: {
      type: [String],
      default: [],
      set: (arr) => [...new Set(arr)],
    },

    interests: {
      type: [String],
      default: [],
      set: (arr) => [...new Set(arr)],
    },

    badges: [
      {
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],

    verificationToken: { type: String, select: false },
    verificationExpire: { type: Date, select: false },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },

    lastLogin: Date,
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
