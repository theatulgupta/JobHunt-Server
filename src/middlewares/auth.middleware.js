import { sendError, sendResponse } from '../../utils/responseHandler.js';

import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return sendResponse(res, 401, false, 'Unauthorized');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return sendResponse(res, 401, false, 'Invalid token');
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    return sendError(res, 500, 'Internal Server Error');
  }
};

export default isAuthenticated;
