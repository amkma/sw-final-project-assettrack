import API from './axiosInstance';

export const loginUser = (credentials) => API.post('/auth/login', credentials);

export const registerUser = (data) => API.post('/auth/register', data);
