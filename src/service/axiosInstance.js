import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const imgPath = "http://localhost:4001/";
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

export const apipath =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api/"
    : process.env.NODE_ENV === "staging"
    ? "https://makapt-api.vercel.app/api/"
    : "/api/";
const axiosInstance = axios.create({
  baseURL: apipath,
});

axiosInstance.interceptors.request.use(function (config) {
  config.headers["Authorization"] = `Bearer ${cookies.get("__mtoken")}`;
  return config;
});
export default axiosInstance;
