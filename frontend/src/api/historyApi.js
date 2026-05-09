import API from './axiosInstance';

/** Get allocation history for a specific asset */
export const getHistoryByAsset = (assetId) =>
  API.get(`/history/asset/${assetId}`, { params: { size: 1000 } });

/** Get allocation history for a specific user */
export const getHistoryByUser = (userId) =>
  API.get(`/history/user/${userId}`, { params: { size: 1000 } });

/**
 * Create a new transfer / allocation record (Admin/Manager).
 * @param {Object} data — { note, assetId, fromUserId, toUserId }
 */
export const createTransfer = (data) => API.post('/history', data);
