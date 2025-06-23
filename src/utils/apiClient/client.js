import axios from 'axios'
import { setRequest, setResponse } from './interceptors'
// eslint-disable-next-line no-unused-vars
import { getToken, removeToken } from '../storage'

const successStatuses = [200, 201]
const publicRoutes = ['api/login']

export default class ApiClient {
  constructor (apiUrl) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }

    this.config = config
    this.apiUrl = apiUrl
    this.client = axios.create({
      baseURL: apiUrl,
      headers: config.headers,
      responseType: 'json',
      maxContentLength: 2000,
      maxBodyLength: 2000
    })
    this.client = setRequest(this.client)
    this.client = setResponse(this.client)
  }

  async getConfigurations (path) {
    const token = publicRoutes.includes(path) ? null : await getToken()
    const { headers } = this.config

    const configuration = token
      ? { ...this.config, headers: { ...headers, Authorization: `Bearer ${token}` } }
      : this.config

    return configuration
  }

  async post (path, data) {
    try {
      return await this.checkStatus(
        await this.client.post(this.apiUrl + path, data, await this.getConfigurations(path))
      )
    } catch (error) {
      // console.log('.......................', error)
      return await this.handleError(error, path)
    }
  }

  async checkStatus (response) {
    if (successStatuses.includes(response.status)) {
      if (response.data.message) {
        // Toast positive message
      }

      return response.data
    } else {
      const error = new Error(response.status)
      error.response = response
      return Promise.reject(error)
    }
  }

  async handleError (error, path) {
    let data
    if (error.response) {
      data = error.response.data
      // console.error(`Error in ${path}:`, error.response)
      if (error.response.status === 401) {
        // console.warn('Unauthorized access - removing token.')
        await removeToken()
      }

      if (error.response.status === 403) {
        // console.warn('Forbidden access - redirecting to dashboard.')
      }

      if (error.response.status === 500) {
        // console.error('Server error - redirecting to dashboard.')
        data = { message: 'Something went wrong. Please try again later.' }
      }
    } else {
      data = error
      // console.error(`Network or other error in ${path}:`, error)
    }

    // showErrors(data)
    // console.log(data)
    return Promise.reject(error)
  }
}

export const setToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const get = (path, params) => request({ path, method: 'GET', data: params });
export const post = (path, data) => request({ path, method: 'POST', data });
export const postAsForm = (path, data) => {
  // console.log(data)
  return request({ path, method: 'POST', data, isFormData: true });
}
export const put = (path, data) => request({ path, method: 'PUT', data });
export const del = (path) => request({ path, method: 'DELETE' });
