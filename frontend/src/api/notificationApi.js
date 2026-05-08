import API from './axiosInstance';

/** Get all notifications for the authenticated user */
export const getNotifications = () => API.get('/notifications');

/**
 * Mark a single notification as read.
 * @param {number} id — notification ID
 */
export const markAsRead = (id) => API.put(`/notifications/${id}/read`);
