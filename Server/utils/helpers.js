// Respond.js
const createResponse = (success, statusCode, data = null, message = "") => {
  return {
    success: success,
    statusCode: statusCode,
    data: data,
    message: message,
  };
};

module.exports = { createResponse };
