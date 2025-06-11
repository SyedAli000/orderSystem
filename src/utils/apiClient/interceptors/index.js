export const setRequest = (apiClient) => {
  apiClient.interceptors.request.use(
    (config) => {
      // Modify the request (e.g., add headers)
      return config
    },
    (error) => {
      // Handle request error
      return Promise.reject(error)
    }
  )
  return apiClient
}

export const setResponse = (apiClient) => {
  apiClient.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // Handle response error
      return Promise.reject(error)
    }
  )
  return apiClient
}
