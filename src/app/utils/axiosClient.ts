import axios from "axios";
import { toast } from "react-toastify";
import { decryptData } from "./webCrypto";

const getUserToken = async () => {
  const encryptedToken = localStorage.getItem("authToken");
  if (!encryptedToken) return null;

  try {
    const decryptedToken = await decryptData(encryptedToken);
    return decryptedToken;
  } catch {
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: "https://localhost:44358/api/",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    document.body.classList.add("loading-indicator");

    const token = await getUserToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    document.body.classList.remove("loading-indicator");
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    document.body.classList.remove("loading-indicator");
    return response;
  },
  (error) => {
    document.body.classList.remove("loading-indicator");

    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Something went wrong";

    if (status === 401) {
      window.location.href = "/";
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
