import axios from "axios";

export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_BE,
});

apiPublic.interceptors.response.use((response) => response.data);

export const api = axios.create({
  baseURL: import.meta.env.VITE_BE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("at");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await getNewAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        sessionStorage.setItem("at", newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response.data);
  }
);

async function getNewAccessToken() {
  try {
    const rt = sessionStorage.getItem("rt");
    if (!rt) throw new Error("No refresh token found");

    const response = await api.post("/auth/refresh-token", {
      refreshToken: rt,
    });
    const newAccessToken = response.data.accessToken;
    sessionStorage.setItem("at", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh access token", error);
    throw error;
  }
}
