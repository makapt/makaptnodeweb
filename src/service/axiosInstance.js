import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const ENV = process.env.NEXT_PUBLIC_ENV || "development";
console.log("ENV", process.env.NODE_ENV);
export const apipath =
  ENV === "development"
    ? "http://localhost:8000/api/"
    : ENV === "staging"
    ? "https://serv-makapt.vercel.app/api/"
    : "https://makapt.com/api/";

console.log("testing :", ENV);
console.log("Using API base path:", apipath);

const axiosInstance = axios.create({
  baseURL: apipath,
});

axiosInstance.interceptors.request.use(function (config) {
  const token = cookies.get("__mtoken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
