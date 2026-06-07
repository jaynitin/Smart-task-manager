import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — normalise errors
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(msg));
  }
);

// export const taskService = {
//   getAll:    ()           => http.get('/todos'),
//   getById:   (id)         => http.get(`/todos/${id}`),
//   create:    (task)       => http.post('/todos', task),
//   update:    (id, data)   => http.put(`/todos/${id}`, data),
//   patch:     (id, data)   => http.patch(`/todos/${id}`, data),
//   remove:    (id)         => http.delete(`/todos/${id}`),
// };

export const taskService = {
    create: (task) => Promise.resolve(task),
    update: (id, changes) => Promise.resolve({ id, ...changes }),
    remove: (id) => Promise.resolve(id),
  };