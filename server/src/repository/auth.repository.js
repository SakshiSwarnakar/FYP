import User from "../models/user.model.js";

export const createUser = (data) => User.create(data);

export const findUserByEmail = (email) =>
  User.findOne({ email }).select("+password");

export const findUserById = (id) => User.findById(id).lean({ virtuals: true });

export const findUserByResetToken = (hashedToken) =>
  User.findOne({ resetPasswordToken: hashedToken }).select("+password");
