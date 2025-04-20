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

doctorFactory.reviewList = async ({ docId, filter, limit, page }) => {
  const response = await axiosInstance.get("reviews", {
    params: {
      docId,
      filter,
      limit,
      page,
    },
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

doctorFactory.doctorSpecialization = async (id) => {
  const response = await axiosInstance.get("doctor-specialization", {
    params: {
      id,
    },
  });
  return response;
};

doctorFactory.getReviewDetails = async (id) => {
  const response = await axiosInstance.get("get-reviewDetails", {
    params: {
      id,
    },
  });
  return response;
};

doctorFactory.savePatientReview = async (data) => {
  const response = await axiosInstance.post("save-patientReview", data);
  return response;
};

doctorFactory.editPatientReview = async (data, id) => {
  const response = await axiosInstance.post("edit-patientReview", data, {
    params: {
      id,
    },
  });
  return response;
};

export default doctorFactory;
