export function setAuthToken(token) {
  localStorage.setItem('token', token)
}

export function getAuthToken() {
  return localStorage.getItem('token')
}

export function removeAuthToken() {
  localStorage.removeItem('token')
}

export function isAuthenticated() {
  return !!getAuthToken()
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login'; // or use Vue router if preferred
}

export function isLoggedIn() {
  return !!localStorage.getItem('token')
}
