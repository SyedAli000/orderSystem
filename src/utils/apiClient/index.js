// services/apiclient/apiClient.js
import ApiClient from './client'
import { BASE_API_URL } from '../urls'
export const apiClient = new ApiClient(BASE_API_URL)

