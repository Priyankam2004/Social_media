import API from '../../utils/axios';

// Get user profile
export const getProfile = async () => {
  const response = await API.get('/api/users/profile');
  return response.data;
};

// Update user profile
export const updateProfile = async (formData) => {
  const response = await API.put('/api/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
