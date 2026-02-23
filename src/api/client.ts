import axios from 'axios'

const BASE_URL = 'https://cards-marketplace-api.onrender.com'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Anexa o JWT em toda requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cv_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normaliza mensagens de erro
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Ocorreu um erro inesperado.'
    return Promise.reject(new Error(message))
  }
)
