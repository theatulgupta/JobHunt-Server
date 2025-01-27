import { sendError, sendResponse } from '../../utils/responseHandler.js';

import { Job } from '../models/job.model.js';

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      openings,
      company,
    } = req.body;

    const requiredFields = [
      title,
      description,
      salary,
      location,
      jobType,
      experience,
      position,
      openings,
      company,
    ];

    if (requiredFields.some((field) => !field)) {
      return sendError(res, 400, 'All fields are required');
    }

    const requirementsArray = Array.isArray(requirements)
      ? requirements
      : requirements?.split(',') || [];

    const job = await Job.create({
      title,
      description,
      requirements: requirementsArray,
      salary: Number(salary),
      location,
      jobType,
      experience,
      position,
      openings,
      company,
      postedBy: req.id,
    });

    return sendResponse(res, 201, true, 'New Job created successfully', job);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || '';
    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};

    const jobs = await Job.find(query).populate('company').sort({ createdAt: -1 });

    if (!jobs.length) {
      return sendError(res, 404, 'No jobs found');
    }

    return sendResponse(res, 200, true, 'Jobs found', jobs);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applications').sort({ createdAt: -1 });

    if (!job) {
      return sendError(res, 404, 'Job not found');
    }

    return sendResponse(res, 200, true, 'Job found', job);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.id }).populate('company').sort({ createdAt: -1 });

    if (!jobs.length) {
      return sendError(res, 404, 'No jobs found');
    }

    return sendResponse(res, 200, true, 'Jobs found', jobs);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
