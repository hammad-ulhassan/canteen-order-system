import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllMenuItems = async () => {
  const response = await api.get('/menu-item/all');
  return response.data;
};

export const getAllStudents = async () => {
  const response = await api.get('/student/all');
  return response.data;
};

export default api;