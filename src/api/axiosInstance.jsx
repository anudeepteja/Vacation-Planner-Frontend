import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("Bearer", token);
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// Response interceptor → refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("REFRESH Token", refreshToken);
        const res = await axios.post("http://localhost:8080/auth/refresh", { refreshToken });
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // retry original request
      } catch (err) {
        // Refresh failed → logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert("Session expired. Please log in again.");
        window.location.href = "/login"; // redirect to login
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
