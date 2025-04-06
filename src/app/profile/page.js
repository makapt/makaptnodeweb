"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaPencilAlt } from "react-icons/fa";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import EditInput from "@/components/ui/editInput";
import DateOfBirthPicker from "@/components/ui/dateOfBirthPicker";
import SelectBox from "@/components/ui/selectBox";
import profileFactory from "../../actions/profileAction";
import CacheImage from "@/components/ui/cacheImage";
import toast from "react-hot-toast";

const Profile = () => {
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      fullName: "",
      birth: "",
      mobile: "",
      gender: "",
      email: "",
    },
  });

  const [profile, setProfile] = useState();
  const [loader, setLoader] = useState(false);
  const [apiError, setApiError] = useState({ error: false });

  const getProfile = useCallback(async () => {
    try {
      const res = await profileFactory.getProfile();
      setProfile(res.data);
      const profileData = res.data.data;

      setValue("fullName", profileData.fullName);
      setValue("email", profileData.email);
      setValue("mobile", profileData.mobile);
      setValue("gender", profileData.gender);

      if (profileData?.birth) {
        const formattedDate = new Date(profileData.birth)
          .toISOString()
          .split("T")[0];
        console.log("formattedDate", formattedDate);
        setValue("birth", formattedDate);
      }
    } catch (e) {
      console.log("error11", e.message);
    }
  }, [setValue]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleImgChange = async (e) => {
    const data = new FormData();
    data.append("image", e.target.files[0]);
    await profileFactory.uploadimg(data);
    getProfile();
    toast.success("Profile image successfully uploaded.");
  };

  const onSubmit = async (data) => {
    try {
      setLoader(true);
      const res = await profileFactory.updateProfile(data);
      getProfile();
      toast.success(res.data.data);
    } catch (e) {
      setApiError({ error: true, ...e.response?.data });
    } finally {
      setLoader(false);
    }
  };

  if (!profile) {
    return <div>Loading... </div>;
  }
  return (
    <div className="px-4 py-4">
      <div className="mt-2 md:mt-0 mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg">
        <div className="flex gap-4 md:gap-6">
          <div
            style={{ width: 112, height: 112 }}
            className="relative md:w-30 h-auto md:h-30 mb-4 md:mb-0"
          >
            <CacheImage
              path={profile.path}
              src={profile.data.image}
              width={100}
              height={100}
              style={{ width: 112, height: 112 }}
            />

            <label
              htmlFor="profileImage"
              className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-300"
            >
              <FaPencilAlt size={14} className="text-gray-600" />
            </label>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              accept="image/*"
              onChange={handleImgChange}
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">
              {profile.data.fullName}
            </h2>
            <p className="text-sm mb-1">
              Mob: {profile.data.mobile}{" "}
              {profile.data.email && "Email: " + profile.data.email}
            </p>
            <p className="text-sm mb-1">
              Total Appointment: {profile.data.apptCount}
            </p>
            <p className="text-sm mb-1">
              Total Member: {profile.data.memberCount}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg">
        <div className="">
          <h2 className="text-xl font-semibold mb-2">Personal Info</h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="w-full">
              <Controller
                name="fullName"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    label="Enter Full Name"
                    type="text"
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border rounded-lg"
                    error={error}
                    invalid={invalid}
                  />
                )}
              />
            </div>
            <div className="w-full">
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <EditInput
                    {...field}
                    label="Enter Mobile Number"
                    type="text"
                    placeholder="Enter Mobile Number"
                    className="w-full px-4 py-2 border rounded-lg"
                    error={error}
                    invalid={invalid}
                  />
                )}
              />
            </div>

            <div className="w-full">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    label="Enter Email Address"
                    type="email"
                    placeholder="Enter Email Address"
                    className="w-full px-4 py-2 border rounded-lg"
                    error={error}
                    invalid={invalid}
                  />
                )}
              />
            </div>

            <div className="w-full">
              <Controller
                name="gender"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <SelectBox
                    {...field}
                    type="text"
                    label="Select Your Gender"
                    className="w-full px-4 py-2 border rounded-lg"
                    error={error}
                    invalid={invalid}
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Others", value: "others" },
                    ]}
                  />
                )}
              />
            </div>

            <div className="w-full">
              <Controller
                name="birth"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <DateOfBirthPicker
                    label="Date of Birth"
                    {...field}
                    error={error}
                    invalid={invalid}
                  />
                )}
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <Button
                isLoading={loader}
                type="submit"
                className="cursor-pointer w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
