import axiosInstance from "@/service/axiosInstance";

const appointmentFactory = {};

appointmentFactory.checkPatientLimit = async (data) => {
  const response = await axiosInstance.post("check-patient-limit", data);
  return response;
};

appointmentFactory.createOrder = async (data) => {
  const response = await axiosInstance.post("create-order", data);
  return response;
};

appointmentFactory.verifyOrderCreateAppt = async (data) => {
  const response = await axiosInstance.post("verify-order-create-appt", data);
  return response;
};

appointmentFactory.getAppointments = async ({ page, limit, apptType }) => {
  const response = await axiosInstance.get("appointments", {
    params: {
      limit: limit,
      apptType,
      page,
    },
  });
  return response;
};

appointmentFactory.appointmentDetail = async (id) => {
  const response = await axiosInstance.get("appointmentDetail", {
    params: {
      id,
    },
  });
  return response;
};

appointmentFactory.cancelAppointment = async (data, id) => {
  const response = await axiosInstance.post("cancel-appointment", data, {
    params: {
      id,
    },
  });
  return response;
};

appointmentFactory.rescheduleAppt = async (data, id) => {
  const response = await axiosInstance.post("reschedule-appt", data, {
    params: {
      id,
    },
  });
  return response;
};

appointmentFactory.getschedulelist = async (docId) => {
  const response = await axiosInstance.get("get-schedule", {
    params: {
      docId,
    },
  });
  return response;
};

appointmentFactory.getOrderInfo = async (orderId) => {
  const response = await axiosInstance.get("order-info/" + orderId);
  return response;
};

appointmentFactory.getRealTimeWaitingNo = async (data) => {
  console.log("data", data);
  const response = await axiosInstance.get("getRealTimeWaitingNo", {
    params: data,
  });
  return response;
};

export default appointmentFactory;
