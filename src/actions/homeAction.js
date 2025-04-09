import axiosInstance from "../service/axiosInstance";

const homeFactory = {};

homeFactory.autocomplete = async (searchQuery) => {
  const response = await axiosInstance.get("autocomplete", {
    params: {
      searchQuery,
    },
  });
  return response;
};

homeFactory.getAddressFromCoordinates = async (lat, lng) => {
  const response = await axiosInstance.get("get-current-location", {
    params: {
      lat,
      lng,
    },
  });
  return response;
};

homeFactory.globalSearch = async ({ query }) => {
  const response = await axiosInstance.get("globalSearch", {
    params: {
      query,
    },
  });
  return response;
};

homeFactory.getDefaultSpecialization = async () => {
  const response = await axiosInstance.get("default-specialization");
  return response;
};

homeFactory.getAllSpecialization = async (limit, page) => {
  const response = await axiosInstance.get("specializatio-list", {
    params: {
      limit,
      page,
    },
  });
  return response;
};

export default homeFactory;
