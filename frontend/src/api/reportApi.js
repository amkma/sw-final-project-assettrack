import API from './axiosInstance';

const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.roleId ?? null;
  } catch {
    return null;
  }
};

/** Get all reports (Manager+ or scoped for User) */
export const getReports = () => {
  const role = getUserRole();
  const endpoint = role === 0 ? '/reports/me' : '/reports';
  return API.get(endpoint, { params: { size: 1000 } });
};

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
