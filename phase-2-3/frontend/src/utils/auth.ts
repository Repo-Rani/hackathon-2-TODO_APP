export const logout = () => {
  // Remove token from localStorage
  localStorage.removeItem('access_token');

  // Clear cookie
  document.cookie = 'access_token=; path=/; max-age=0';

  // Redirect to signin page
  window.location.href = '/signin';
};