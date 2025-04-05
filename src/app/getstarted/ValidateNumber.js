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
import { useRouter } from "next/navigation";

const mobileSchema = yup.object().shape({
  mobile: yup
    .string()
    .required("Please enter mobile number")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "Phone number is not valid")
    .max(10, "Phone number is not valid"),
});

const ValidateNumber = ({ handlerNewUser, setMobile }) => {
  const { login } = useApplicationContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectionURL = searchParams.get("redirectionURL");
  const [isSentOTP, setSentOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
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
    console.log("dataaaa", data);
    try {
      const res = await authFactory.signupOTP(data);
      setSentOTP(true);
    } catch (e) {
      console.log("eeeee", e);
    }
  };

  const handleEditPhone = () => {
    setOtp("");
    setPassword("");
    setUsePasswordLogin(false);
    setSentOTP(false);
    setLoader(false);
  };

  const onFormSubmit = async () => {
    try {
      setLoader(true);
      const mobile = getValues("mobile");
      if (isSentOTP) {
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
        }
      } else {
        if (!password) {
          return toast.error("⚠ Please enter your password.");
        }
        await authFactory.signinWithPassword({
          password,
          mobile,
        });
      }
      setMobile(mobile);
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
      <p className="text-gray-600 text-center mb-6">
        Enter your mobile number to continue
      </p>

      {/* Phone Input Field */}
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

      {usePasswordLogin && (
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
      )}

      {isSentOTP ? (
        <Button
          className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
          onClick={onFormSubmit}
          isLoading={loader}
          disabled={loader}
        >
          Next
        </Button>
      ) : (
        <Button
          className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
          onClick={handleSubmit(sendOTpHandler)}
          disabled={loader}
        >
          Continue
        </Button>
      )}

      {/* Terms & Conditions */}
      <p className="text-center text-sm text-gray-600 mt-5">
        By clicking Continue, you agree to MAKAPT’s
        <a href="#" className="text-blue-600">
          {" "}
          Privacy Policy
        </a>
        ,
        <a href="#" className="text-blue-600">
          {" "}
          Terms and Conditions
        </a>
        .
      </p>

      <p
        className="text-center text-blue-600 mt-4 cursor-pointer"
        onClick={() => setUsePasswordLogin(!usePasswordLogin)}
      >
        {usePasswordLogin ? "Login using OTP" : "Login using password"}
      </p>
    </div>
  );
};

export default ValidateNumber;
