import axiosInstance from "../service/axiosInstance";

const doctorFactory = {};

doctorFactory.getDoctorLists = async (query) => {
  const response = await axiosInstance.get("getDoctorLists", {
    params: query,
  });
  return response;
};

doctorFactory.doctordetail = async (query) => {
  const response = await axiosInstance.get("doctordetail", {
    params: query,
  });
  return response;
};

doctorFactory.getDoctorUnavailability = async (query) => {
  const response = await axiosInstance.get("get-doctor-unavailability", {
    params: query,
  });
  return response;
};

doctorFactory.apptSummaryDetail = async (id) => {
  const response = await axiosInstance.get("appt-summary", {
    params: {
      id,
    },
  });
  return response;
};

export default doctorFactory;
