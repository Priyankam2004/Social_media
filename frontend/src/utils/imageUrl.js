/**
 * Resolves an image path to a full URL.
 *
 * In development, Vite proxies /uploads to the backend so relative paths work.
 * In production, the frontend and backend are on different origins, so we need
 * to prepend the backend base URL.
 *
 * @param {string} path - e.g. "/uploads/abc123.jpg"
 * @returns {string} Full URL to the image
 */
export const getImageUrl = (path) => {
  if (!path) return '';

  // Already a full URL, blob, or data URI
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  // In production, prepend the backend URL
  const backendUrl = import.meta.env.VITE_API_URL || '';
  return `${backendUrl}${path}`;
};
