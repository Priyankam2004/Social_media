import API from '../../utils/axios';

// Register user
export const registerUser = async (formData) => {
  const response = await API.post('/api/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await API.post('/api/auth/login', credentials);
  return response.data;
};

// Get current user
export const getMe = async () => {
  const response = await API.get('/api/auth/me');
  return response.data;
};
