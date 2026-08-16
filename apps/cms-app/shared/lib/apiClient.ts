import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
  }
  return config;
});

export default apiClient;
