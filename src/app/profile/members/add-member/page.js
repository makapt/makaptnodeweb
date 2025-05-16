"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import SelectBox from "@/components/ui/selectBox";
import profileFactory from "@/actions/profileAction";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { phoneRegExp } from "@/utils/regex";
import TextArea from "@/components/ui/textArea";

export const memberSchema = yup.object().shape({
  patientName: yup.string().required("Patient name is required field"),
  mobile: yup
    .string()
    .required("Mobile number is required field")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "Phone number is not valid")
    .max(10, "Phone number is not valid"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is a required field")
    .min(0, "Age must be at least 0")
    .max(120, "Age must be less than or equal to 120"),
  address: yup.string().required("Address is required field"),
  gender: yup.string().required("Gender is required field"),
  patientEmail: yup.string(),
});

const defaultValues = {
  patientName: "",
  mobile: "",
  age: "",
  address: "",
  gender: "",
  patientEmail: "",
};

const AddMember = () => {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(memberSchema),
    defaultValues: defaultValues,
  });

  const [profile, setProfile] = useState();
  const [loader, setLoader] = useState(false);
  const [apiError, setApiError] = useState({ error: false });

  const getProfile = useCallback(async () => {
    try {
      const res = await profileFactory.getProfile();
      setProfile(res.data);
    } catch (e) {
      console.log("error11", e.message);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const onSubmit = async (data) => {
    try {
      setLoader(true);
      const res = await profileFactory.addMember(data);
      toast.success(res.data.data);
      reset();
      setTimeout(() => {
        goBack();
      }, 1000);
    } catch (e) {
      setApiError({ error: true, ...e.response?.data });
    } finally {
      setLoader(false);
    }
  };

  const goBack = () => {
    // router.push("/profile/members");
    router.back();
  };

  if (!profile) {
    return <div>Loading... </div>;
  }
  return (
    <div className="ml-4 mr-4 mt-5 ">
      <button
        onClick={goBack}
        className="py-3 md:hidden flex items-center text-blue-600 hover:text-blue-800 text-md font-medium"
      >
        <FiArrowLeft className="mr-1 h-5 w-5" />
        Back
      </button>
      <div className="mx-auto bg-white p-4 md:p-6 rounded-lg drop-shadow-lg">
        <div className="">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="w-full">
              <Controller
                name="patientName"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Patient name"
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
                rules={{ required: true }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
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
                name="age"
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Age"
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

            <div className="w-full col-span-1 md:col-span-2">
              <Controller
                name="address"
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <TextArea
                    {...field}
                    type="text"
                    placeholder="Enter Address"
                    className="w-full px-4 py-2 border rounded-lg"
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
                Add Member
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
