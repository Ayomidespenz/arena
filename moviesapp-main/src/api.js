import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Change to your backend URL if deployed

// Auth
export const register = (userData) => axios.post(`${API_URL}/auth/register`, userData);
export const login = (userData) => axios.post(`${API_URL}/auth/login`, userData);

// Movies
export const getMovies = (params) => axios.get(`${API_URL}/movies`, { params });
export const getMovie = (id) => axios.get(`${API_URL}/movies/${id}`);
export const createMovie = (movie, token) => axios.post(`${API_URL}/movies`, movie, { headers: { Authorization: `Bearer ${token}` } });
export const updateMovie = (id, movie, token) => axios.put(`${API_URL}/movies/${id}`, movie, { headers: { Authorization: `Bearer ${token}` } });
export const deleteMovie = (id, token) => axios.delete(`${API_URL}/movies/${id}`, { headers: { Authorization: `Bearer ${token}` } });

// Token helpers
export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token'); 