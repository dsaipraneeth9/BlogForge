import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export const registerUser = (data) => api.post('/users/register', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const loginUser = (data) => api.post('/users/login', data);
export const forgotPassword = (email) => api.post('/users/forgot-password', { email });
export const resetPassword = (token, data) => api.post(`/users/reset-password/${token}`, data);
export const logoutUser = () => api.get('/users/logout');
export const updateProfile = (id, data) => api.patch(`/users/profile/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });