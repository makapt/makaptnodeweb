"use client";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { phoneRegExp } from "@/utils/regex";
import authFactory from "../../actions/authAction";
import toast from "react-hot-toast";
import { useApplicationContext } from "@/context/ApplicationContext";

const mobileSchema = yup.object().shape({
  mobile: yup
    .string()
    .required("Please enter mobile number")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "Phone number is not valid")
    .max(10, "Phone number is not valid"),
});

const LoginWithOTP = ({ handlerNewUser, setMobile }) => {
  const { login } = useApplicationContext();
  const searchParams = useSearchParams();
  const redirectionURL = searchParams.get("redirectionURL");
  const [isSentOTP, setSentOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [usePasswordLogin, setUsePasswordLogin] = useState(false);
  const [loader, setLoader] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(mobileSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const sendOTpHandler = async (data) => {
    try {
      setLoader(true);
      await authFactory.signupOTP(data);
      setSentOTP(true);
    } catch (e) {
      console.log("eeeee", e);
    } finally {
      setLoader(false);
    }
  };

  const handleEditPhone = () => {
    setOtp("");
    setUsePasswordLogin(false);
    setSentOTP(false);
    setLoader(false);
  };

  const onFormSubmit = async () => {
    try {
      setLoader(true);
      const mobile = getValues("mobile");

      if (!otp || otp.length !== 4) {
        return toast.error("⚠ Enter a 4-digit OTP.");
      }

      const res = await authFactory.validateOTP({
        otp: parseInt(otp),
        mobile: mobile,
      });
      if (res.data.isLogin) {
        login(res.data.token, redirectionURL);
      } else {
        handlerNewUser(true);
        setMobile(mobile);
      }
    } catch (e) {
      let msg = "Something went wrong!";
      if (e.response?.data) {
        msg = e.response?.data.message;
      }
      toast.error(msg);
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
              <>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter mobile number"
                  className="w-full px-4 py-2 border rounded-lg"
                  disabled={isSentOTP}
                  error={error}
                  invalid={invalid}
                />
                {!usePasswordLogin && (
                  <FaEdit
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={handleEditPhone}
                  />
                )}
              </>
            );
          }}
          name="mobile"
        />
      </div>

      {isSentOTP && !usePasswordLogin && (
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
      )}

      {isSentOTP ? (
        <Button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
          onClick={onFormSubmit}
          isLoading={loader}
          disabled={loader}
        >
          Next
        </Button>
      ) : (
        <Button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
          onClick={handleSubmit(sendOTpHandler)}
          isLoading={loader}
          disabled={loader}
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default LoginWithOTP;
