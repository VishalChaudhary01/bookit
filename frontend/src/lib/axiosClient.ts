import axios from "axios";

export const baseURL = process.env.NEXT_PUBLIC_SERVER_API_BASE_URL;

const options = {
  baseURL: `${baseURL}/api/v1`,
  timeout: 10000,
};

const API = axios.create(options);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message = error?.response?.data?.message;

    console.error("API Error:", message || error.message);
    return Promise.reject(error);
  }
);

export default API;
