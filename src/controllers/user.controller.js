import { sendError, sendResponse } from '../../utils/responseHandler.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import cloudinary from '../../utils/cloudinary.js';
import getDataUri from '../../utils/datauri.js';
import { User } from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { fullname, email, phone, password, role } = req.body;

    if (!fullname || !email || !phone || !password || !role) {
      return sendError(res, 400, 'All fields are required');
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    if (!validator.isEmail(email)) {
      return sendError(res, 400, 'Invalid email format');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phone,
      password: hashedPassword,
      role,
      'profile.profilePhoto': cloudResponse.secure_url,
    });

    return sendResponse(res, 201, true, 'Account created successfully.');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return sendError(res, 400, 'All fields are required');
    }

    if (!validator.isEmail(email)) {
      return sendError(res, 400, 'Invalid email format');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password)) || role !== user.role) {
      return sendError(res, 400, 'Incorrect credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Exclude the password and __v fields before sending the response
    const { password: _, __v, ...userData } = user.toObject();

    res.cookie('token', token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
    });

    return sendResponse(res, 200, true, `Welcome back ${userData.fullname}`, { user: userData });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
    return sendResponse(res, 200, true, 'Logged out successfully.');
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phone, bio, skills } = req.body;

    const file = req.file;

    if (!validator.isEmail(email)) {
      return sendError(res, 400, 'Invalid email format');
    }

    const fileUri = getDataUri(file);
    let cloudResponse;
    try {
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      return sendError(res, 500, 'An error occurred while uploading the file');
    }

    const userId = req.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullname && { fullname }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(bio && { 'profile.bio': bio }),
        ...(skills && { 'profile.skills': skills.split(',') }),
        ...(file && { 'profile.resume': cloudResponse.secure_url }), // Save resume url
        ...(file && { 'profile.resumeOriginalName': file.originalname }), // Save Original resume name
      },
      { new: true, select: '-password -__v' },
    );

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendResponse(res, 200, true, 'Profile updated successfully', { user });
  } catch (error) {
    console.error('Error updating profile:', error);
    return sendError(res, 500, error.message);
  }
};
