import API from './axiosInstance';

/** Get all reports (Manager+) */
export const getReports = () => API.get('/reports', { params: { size: 1000 } });

/**
 * Create a new condition report (any authenticated user).
 * @param {Object} data — { assetId, userId, description }
 */
export const createReport = (data) => API.post('/reports', data);

/**
 * Update the status of a report (Manager+).
 * @param {number} id
 * @param {string} status — e.g. "Pending", "Reviewed", "Resolved"
 */
export const updateReportStatus = (id, status) =>
  API.patch(`/reports/${id}/status`, null, { params: { status } });
