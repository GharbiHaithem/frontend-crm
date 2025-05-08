import axios from "axios";
import { BACKENDAPI } from "../utils/constant/constant";

// Create an axios instance with default config
const api = axios.create({
  baseURL: BACKENDAPI,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
  getUsers: () => api.get("/auth/list"),
};

// Client services
export const clientService = {
  getAll: (page = 1, filters = {}) =>
    api.get("/clients", { params: { page, ...filters } }),
  getById: (id) => api.get(`/clients/${id}`),
  getByCode: (code) => api.get(`/clients/code/${code}`),
  create: (clientData) => api.post("/clients", clientData),
  update: (id, clientData) => api.put(`/clients/${id}`, clientData),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Article services
export const articleService = {
  getAll: () => api.get("/articles"),
  getById: (id) => api.get(`/articles/${id}`),
  getByCode: (code) => api.get(`/articles/code/${code}`),
  create: (articleData) => {
    const formData = new FormData();
    Object.keys(articleData).forEach((key) => {
      formData.append(key, articleData[key]);
    });
    return api.post("/articles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: (id, articleData) => api.put(`/articles/${id}`, articleData),
  delete: (id) => api.delete(`/articles/${id}`),
};

// Famille services
export const familleService = {
  getAll: () => api.get("/famille"),
  getById: (id) => api.get(`/famille/${id}`),
  create: (familleData) => api.post("/famille", familleData),
  update: (id, familleData) => api.put(`/famille/${id}`, familleData),
  delete: (id) => api.delete(`/famille/${id}`),
};

// Categorie services
export const categorieService = {
  getAll: () => api.get("/categorie"),
  getById: (id) => api.get(`/categorie/${id}`),
  create: (categorieData) => api.post("/categorie", categorieData),
  update: (id, categorieData) => api.put(`/categorie/${id}`, categorieData),
  delete: (id) => api.delete(`/categorie/${id}`),
};

// Document services
export const documentService = {
  getAll: (type) => api.get("/entetes", { params: { type } }),
  getById: (id) => api.get(`/entetes/${id}`),
  create: (documentData) => api.post("/entetes/devis", documentData),
  update: (documentData) => api.put("/entetes/devis", documentData),
  delete: (id) => api.delete(`/entetes/${id}`),
  downloadPdf: (id) => api.get(`/entetes/${id}/pdf`, { responseType: "blob" }),
  getTotalByTypeAndYear: (type, year) =>
    api.get(`/entetes/total/${type}/${year}`),
};

// Event services
export const eventService = {
  getAll: () => api.get("/api/events"),
  getById: (id) => api.get(`/api/events/${id}/show`),
  create: (eventData) => api.post("/api/events", eventData),
};

export default api;
