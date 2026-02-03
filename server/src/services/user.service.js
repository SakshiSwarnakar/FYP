import { HTTP_STATUS } from "../constants/http.js";
import {
  findUserById,
  findUserDocById,
} from "../repository/auth.repository.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";

export const getUserProfileService = async (userId) => {
  const user = await findUserById(userId);

  assertOrThrow(user, HTTP_STATUS.NOT_FOUND, "User not found");

  const profile = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,

    profilePic: user.profilePic?.url || null,

    skills: user.skills ?? [],
    interests: user.interests ?? [],
    badges: user.badges ?? [],

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (user.role === "ADMIN") {
    profile.organization = {
      name: user.organizationName,
      description: user.organizationDescription,
      type: user.organizationType,
      logo: user.organizationLogo?.url || null,
      phone: user.organizationPhone,
      email: user.organizationEmail,
      location: user.organizationLocation ?? null,
    };
  }

  return profile;
};

export const updateUserProfileService = async (
  currentUser,
  targetUserId,
  data,
  file
) => {
  if (currentUser.role !== "ADMIN" && currentUser.id !== targetUserId) {
    throw new AppError("Forbidden", HTTP_STATUS.FORBIDDEN);
  }

  const user = await findUserDocById(targetUserId);

  assertOrThrow(user, HTTP_STATUS.NOT_FOUND, "User not found");

  const allowedCommonFields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "skills",
    "interests",
  ];

  for (const field of allowedCommonFields) {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  }

  if (currentUser.role === "ADMIN") {
    const adminFields = [
      "organizationName",
      "organizationDescription",
      "organizationType",
      "organizationPhone",
      "organizationEmail",
      "organizationLocation",
      "role",
    ];

    for (const field of adminFields) {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    }
  }

  if (file) {
    if (user.profilePic?.public_id) {
      await deleteFromCloudinary(user.profilePic.public_id);
    }
    const upload = await uploadToCloudinary(file.buffer, "profile_pics");

    user.profilePic = {
      url: upload.secure_url,
      public_id: upload.public_id,
    };
  }

  await user.save();

  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profilePic: user.profilePic?.url || null,
    skills: user.skills,
    interests: user.interests,
    updatedAt: user.updatedAt,
  };
};
