import { sendError, sendResponse } from '../../utils/responseHandler.js';

import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return sendError(res, 400, 'Job ID is required');
    }

    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication) {
      return sendError(res, 400, 'You have already applied for this job');
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 404, 'Job not found');
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(application._id);
    await job.save();

    return sendResponse(res, 201, true, 'Application submitted successfully', application);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'job',
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: 'company',
          options: {
            sort: { createdAt: -1 },
          },
        },
      });

    if (!applications.length) {
      return sendError(res, 404, 'No applications found');
    }

    return sendResponse(res, 200, true, 'Applications found', applications);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'applications',
      options: {
        sort: { createdAt: -1 },
      },
      populate: {
        path: 'applicant',
        options: {
          sort: { createdAt: -1 },
        },
      },
    });

    if (!job) {
      return sendError(res, 404, 'Job not found');
    }

    return sendResponse(res, 200, true, 'Applicants found', job.applications);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return sendError(res, 400, 'Status is required');
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: status.toLowerCase() },
      { new: true },
    );

    if (!application) {
      return sendError(res, 404, 'Application not found');
    }

    return sendResponse(res, 200, true, 'Application status updated successfully', application);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
