import axiosInstance from "../service/axiosInstance";

const apiFactory = {};

apiFactory.getHome = async () => {
  const response = await axiosInstance.get("web-home");
  return response;
};

apiFactory.saveContactus = async (data) => {
  const response = await axiosInstance.post("savecontactus", data);
  return response;
};

apiFactory.getBlogs = async () => {
  const response = await axiosInstance.get("blogs");
  return response;
};

apiFactory.getBlogDetail = async (slugName) => {
  const response = await axiosInstance.get("blogDetail", {
    params: {
      slugName,
    },
  });
  return response;
};

apiFactory.getLeader = async () => {
  const response = await axiosInstance.get("leaders");
  return response;
};

apiFactory.getStaticPage = async (data) => {
  const response = await axiosInstance.get("get-single_static_page", {
    params: {
      name: data,
    },
  });
  return response;
};

apiFactory.getFAQ = async () => {
  const response = await axiosInstance.get("getFaqList");
  return response;
};

export default apiFactory;
