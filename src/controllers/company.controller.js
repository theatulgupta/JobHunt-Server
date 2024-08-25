import { sendError, sendResponse } from '../../utils/responseHandler.js';

import { Company } from '../models/company.model.js';

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName) {
      return sendError(res, 400, 'Company name is required');
    }

    const existingCompany = await Company.findOne({ name: companyName });

    if (existingCompany) {
      return sendError(res, 400, 'Company already exists');
    }

    const newCompany = await Company.create({ name: companyName, userId: req.id });

    return sendResponse(res, 201, true, 'Company registered successfully', newCompany);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id });

    if (companies.length === 0) {
      return sendError(res, 404, 'No companies found');
    }

    return sendResponse(res, 200, true, 'Companies found', companies);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return sendError(res, 404, 'Company not found');
    }

    return sendResponse(res, 200, true, 'Company found', company);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    // TODO - Cloudinary Operations

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(website && { website }),
        ...(location && { location }),
      },
      { new: true },
    );

    if (!company) {
      return sendError(res, 404, 'Company not found');
    }

    return sendResponse(res, 200, true, 'Company data updated successfully', company);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
