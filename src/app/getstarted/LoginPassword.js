"use client";
import { useState } from "react";
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

const LoginPassword = ({}) => {
  const { login } = useApplicationContext();
  const searchParams = useSearchParams();
  const redirectionURL = searchParams.get("redirectionURL");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);

  const { control, handleSubmit, getValues } = useForm({
    resolver: yupResolver(mobileSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const onFormSubmit = async () => {
    try {
      setLoader(true);
      const mobile = getValues("mobile");
      if (!password) {
        return toast.error("⚠ Please enter your password.");
      }
      const res = await authFactory.signinWithPassword({
        password,
        mobile,
      });
      login(res.data.token, redirectionURL);
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
                  error={error}
                  invalid={invalid}
                />
              </>
            );
          }}
          name="mobile"
        />
      </div>

      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        className="w-full px-4 py-2 border rounded-lg"
      />

      <Button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
        onClick={handleSubmit(onFormSubmit)}
        isLoading={loader}
        disabled={loader}
      >
        Continue
      </Button>
    </div>
  );
};

export default LoginPassword;
