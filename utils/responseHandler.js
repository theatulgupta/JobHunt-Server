export const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode, message, errors = null) => {
  const errorResponse = {
    success: false,
    message,
  };

  if (errors) {
    errorResponse.errors = errors;
  }

  return res.status(statusCode).json(errorResponse);
};
