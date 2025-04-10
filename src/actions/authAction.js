import axiosInstance from "../service/axiosInstance";

const authFactory = {};

authFactory.signupOTP = async (data) => {
  const response = await axiosInstance.post("signup-otp", data);
  return response;
};

authFactory.validateOTP = async (data) => {
  const response = await axiosInstance.post("verify-otp", data);
  return response;
};

authFactory.createAccount = async (data) => {
  const response = await axiosInstance.post("signup", data);
  return response;
};

authFactory.signinWithPassword = async (data) => {
  const response = await axiosInstance.post("signinWithPassword", data);
  return response;
};

authFactory.accounts = async () => {
  const response = await axiosInstance.get("accounts");
  return response;
};

authFactory.accountDelete = async () => {
  const response = await axiosInstance.post("delete-account");
  return response;
};

authFactory.getSupportNo = async () => {
  const response = await axiosInstance.get("getSupportNo");
  return response;
};

export default authFactory;
