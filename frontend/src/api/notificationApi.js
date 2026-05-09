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

/**
 * Create a notification for a specific user (Admin/Manager).
 * @param {number} userId
 * @param {string} message
 */
export const createNotification = (userId, message) => API.post(`/notifications/user/${userId}`, message, {
  headers: { 'Content-Type': 'text/plain' }
});

/**
 * Trigger a manual warranty expiration check (Admin only).
 */
export const triggerWarrantyCheck = () => API.post('/notifications/warranty-check');
