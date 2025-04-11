"use client";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import SelectBox from "@/components/ui/selectBox";

import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { phoneRegExp } from "@/utils/regex";
import authFactory from "../../actions/authAction";
import DateOfBirthPicker from "@/components/ui/dateOfBirthPicker";
import TextArea from "@/components/ui/textArea";
import { useApplicationContext } from "@/context/ApplicationContext";

const SignupInfo = ({ mobile }) => {
  const { login } = useApplicationContext();
  const searchParams = useSearchParams();
  const redirectionURL = searchParams.get("redirectionURL");
  const [loader, setLoader] = useState(false);
  const [location, setLocation] = useState({});

  const { control, handleSubmit } = useForm({
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "",
      address: "",
    },
  });

  useEffect(() => {
    getCurrentLatLong();
  }, []);

  const getCurrentLatLong = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lon: longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  };

  const onFormSubmit = async (data) => {
    const newData = {
      ...data,
      mobile: mobile,
      latlong: location,
    };
    console.log("newData", newData);
    try {
      setLoader(true);
      const res = await authFactory.createAccount(newData);
      login(res.data.token, redirectionURL);
    } catch (e) {
      const error = e.response?.data?.message || e.toString();
      setApiError({ error: true, message: error });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div>
      <div className="relative mb-4">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { invalid, error } }) => {
            return (
              <Input
                {...field}
                label="Enter Full Name"
                type="text"
                placeholder="Enter full name"
                className="w-full px-4 py-2 border rounded-lg"
                error={error}
                invalid={invalid}
              />
            );
          }}
          name="fullName"
        />
      </div>

      <div className="relative mb-4">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { invalid, error } }) => {
            return (
              <DateOfBirthPicker
                label="Date of Birth"
                {...field}
                error={error}
                invalid={invalid}
              />
            );
          }}
          name="dob"
        />
      </div>

      <div className="relative mb-4">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { invalid, error } }) => {
            return (
              <SelectBox
                {...field}
                type="text"
                label="Select Your Gender"
                className="w-full px-4 py-2 border rounded-lg"
                error={error}
                invalid={invalid}
                options={[
                  {
                    label: "Male",
                    value: "male",
                  },
                  {
                    label: "Female",
                    value: "female",
                  },
                  {
                    label: "Others",
                    value: "others",
                  },
                ]}
              />
            );
          }}
          name="gender"
        />
      </div>

      <div className="relative mb-4">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState: { invalid, error } }) => {
            return (
              <TextArea
                {...field}
                type="text"
                label="Enter Address"
                placeholder="Enter address"
                className="w-full px-4 py-2 border rounded-lg"
                error={error}
                invalid={invalid}
              />
            );
          }}
          name="address"
        />
      </div>

      <Button
        isLoading={loader}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
        onClick={handleSubmit(onFormSubmit)}
      >
        Register
      </Button>
    </div>
  );
};

export default SignupInfo;
