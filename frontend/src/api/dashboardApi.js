import API from './axiosInstance';

/**
 * Fetch comprehensive dashboard statistics (Admin & Manager only).
 */
export const getDashboardStats = () => API.get('/dashboard/stats');
