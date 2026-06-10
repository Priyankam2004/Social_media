import API from '../../utils/axios';

// Create post
export const createPost = async (formData) => {
  const response = await API.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Get all posts
export const getAllPosts = async () => {
  const response = await API.get('/api/posts');
  return response.data;
};

// Get single post
export const getPostById = async (id) => {
  const response = await API.get(`/api/posts/${id}`);
  return response.data;
};

// Delete post
export const deletePost = async (id) => {
  const response = await API.delete(`/api/posts/${id}`);
  return response.data;
};

// Like / Unlike post
export const likePost = async (id) => {
  const response = await API.put(`/api/posts/like/${id}`);
  return response.data;
};

// Add comment
export const addComment = async (id, text) => {
  const response = await API.post(`/api/posts/comment/${id}`, { text });
  return response.data;
};

// Delete comment
export const deleteComment = async (postId, commentId) => {
  const response = await API.delete(`/api/posts/comment/${postId}/${commentId}`);
  return response.data;
};
