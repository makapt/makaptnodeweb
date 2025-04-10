import axiosInstance from "@/service/axiosInstance";

const profileFactory = {};

profileFactory.changePassword = async (data) => {
  const response = await axiosInstance.post("change-password", data);
  return response;
};

profileFactory.getProfile = async () => {
  const response = await axiosInstance.get("get-profile");
  return response;
};

profileFactory.updateProfile = async (data) => {
  const response = await axiosInstance.post("updateprofile", data);
  return response;
};

profileFactory.uploadimg = async (data) => {
  const response = await axiosInstance.post("profile-img", data);
  return response;
};

profileFactory.getMember = async () => {
  const response = await axiosInstance.get("get-member");
  return response;
};

profileFactory.addMember = async (data) => {
  const response = await axiosInstance.post("add-member", data);
  return response;
};

profileFactory.deleteMember = async (id) => {
  const response = await axiosInstance.get("delete-member", {
    params: {
      id,
    },
  });
  return response;
};

profileFactory.getUserOwnReview = async (param) => {
  const response = await axiosInstance.get("get-userOwnReview", {
    params: param,
  });
  return response;
};

profileFactory.deleteOwnReview = async (id) => {
  const response = await axiosInstance.get("delete-review", {
    params: {
      id,
    },
  });
  return response;
};

profileFactory.appGetIssue = async (category) => {
  const response = await axiosInstance.get("appGetIssue", {
    params: {
      category,
    },
  });
  return response;
};

profileFactory.appGetSelectedIssue = async (id) => {
  const response = await axiosInstance.get("appGetSelectedIssue", {
    params: {
      id,
    },
  });
  return response;
};

export default profileFactory;
