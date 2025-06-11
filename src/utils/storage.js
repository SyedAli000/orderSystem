import { STORAGE_AUTH_KEY } from './urls'

export const getToken = () => {
  return localStorage.getItem(STORAGE_AUTH_KEY);
}

export const setToken = (data) => {
  return localStorage.setItem(STORAGE_AUTH_KEY, data)
}

export const removeToken = (key) => {
  return localStorage.removeItem(STORAGE_AUTH_KEY)
}
