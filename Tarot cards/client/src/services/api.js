import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const cardAPI = {
  getAll: () => axios.get(`${API_URL}/cards`),
  getById: (id) => axios.get(`${API_URL}/cards/${id}`),
  getByType: (type) => axios.get(`${API_URL}/cards?type=${type}`),
  getBySuit: (suit) => axios.get(`${API_URL}/cards?suit=${suit}`),
  search: (query) => axios.get(`${API_URL}/cards/search/${query}`)
};

export const spreadAPI = {
  getAll: () => axios.get(`${API_URL}/spreads`),
  getById: (id) => axios.get(`${API_URL}/spreads/${id}`)
};

export const readingAPI = {
  create: (data) => axios.post(`${API_URL}/readings`, data),
  getAll: () => axios.get(`${API_URL}/readings`),
  getById: (id) => axios.get(`${API_URL}/readings/${id}`),
  delete: (id) => axios.delete(`${API_URL}/readings/${id}`)
};
