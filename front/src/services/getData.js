import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://localhost:4444/api',
});
instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});

class GetData {
  async request(url, method = 'get', data) {
    try {
      if (method.toUpperCase() === 'GET') {
        const response = await instance.get(url);
        return response;
      }

      if (method.toUpperCase() === 'POST') {
        const response = await instance.post(url, data);
        return response;
      }

      if (method.toUpperCase() === 'DELETE') {
        const response = await instance.delete(url);
        return response;
      }

      if (method.toUpperCase() === 'PATCH') {
        const respose = await instance.patch(url, data);
        return respose;
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export const getData = new GetData();
