import axios from "axios"
import type { ApiResponse } from "../types";

const API_URI = import.meta.env.VITE_API_URI;

export const axiosInstance = axios.create({
    baseURL: API_URI,
    withCredentials: true
})

async function request<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<ApiResponse<T>> {
  const { data } = await promise;
  return data; 
}


export const apiClient = {
  get: <T>(url: string, config?: object) =>
    request<T>(axiosInstance.get(url, config)),
  post: <T>(url: string, body?: any, config?: object) =>
    request<T>(axiosInstance.post(url, body, config)),
  put: <T>(url: string, body?: any, config?: object) =>
    request<T>(axiosInstance.put(url, body, config)),
  delete: <T>(url: string, config?: object) =>
    request<T>(axiosInstance.delete(url, config)),
  patch: <T>(url: string, body?: any, config?: object) =>
    request<T>(axiosInstance.patch(url, body, config)),
};