import API from './axiosInstance';

/** Get all notifications for the authenticated user */
export const getNotifications = (userId) => API.get(`/notifications/user/${userId}`, { params: { size: 1000 } });

/** Get unread notification count for the authenticated user */
export const getUnreadCount = (userId) => API.get(`/notifications/user/${userId}/unread-count`);

/**
 * Mark all notifications as read for a user.
 * @param {number} userId
 */
export const markAsRead = (userId) => API.put(`/notifications/user/${userId}/read`);
