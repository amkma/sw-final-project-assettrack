import API from './axiosInstance';

/** Get all users (Manager+) */
export const getUsers = () => API.get('/users');

/** Get a single user by ID (Manager+) */
export const getUserById = (id) => API.get(`/users/${id}`);

/**
 * Update a user (Admin).
 * Typically used to change the user's role.
 * @param {number} id
 * @param {Object} data — e.g. { roleId: 1 }
 */
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
