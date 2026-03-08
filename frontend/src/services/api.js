import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

export const uploadFile = (formData) =>
  api.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getDatasets = () => api.get('/datasets');
export const getDataset = (id) => api.get(`/datasets/${id}`);
export const deleteDataset = (id) => api.delete(`/datasets/${id}`);
export const downloadExportUrl = (id, format) => `${api.defaults.baseURL}/datasets/${id}/export/${format}`;

export default api;
