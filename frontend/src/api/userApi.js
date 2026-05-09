import API from './axiosInstance';
import { ROLE_STRING_TO_ID } from '../utils/constants';

/** Get all users by fetching all 3 roles and combining them (Manager+) */
export const getUsers = async () => {
  const [devs, managers, admins] = await Promise.all([
    API.get('/users?role=0'),
    API.get('/users?role=1'),
    API.get('/users?role=2'),
  ]);
  // Combine all responses
  const allUsers = [...devs.data, ...managers.data, ...admins.data];
  return {
    data: allUsers.map(u => ({ ...u, roleId: ROLE_STRING_TO_ID[u.role] ?? 0 })),
  };
};

/** Get a single user by ID (Manager+) */
export const getUserById = async (id) => {
  const res = await API.get(`/users/${id}`);
  res.data.roleId = ROLE_STRING_TO_ID[res.data.role] ?? 0;
  return res;
};

/**
 * Update a user profile (Admin).
 * @param {Object} data — e.g. { id: 1, firstName: "...", ... }
 */
export const updateUser = (data) => API.put('/users', data);

/**
 * Delete a user (Admin).
 * @param {number} userId
 */
export const deleteUser = (userId) => API.delete(`/users/${userId}`);

/**
 * Change user role (Admin).
 * @param {number} userId
 * @param {number} newRoleId
 */
export const changeRole = (userId, newRoleId) => 
  API.put(`/users/${userId}/role?newRoleId=${newRoleId}`);
