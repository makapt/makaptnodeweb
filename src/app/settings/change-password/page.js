"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/button";
import profileFactory from "@/actions/profileAction";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";
import useDeviceType from "@/hooks/useDeviceType";
import PasswordInput from "@/components/ui/input";

const schema = yup.object().shape({
  newPassword: yup.string().required("New password is required field"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required field")
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});

const settingsOptions = [
  { label: "Change Password", href: "/settings/change-password" },
  { label: "Delete Account", href: "/settings/delete-account" },
];

const ChangePassword = () => {
  const { isMobile } = useDeviceType();
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(pathname);
  const [profile, setProfile] = useState();
  const [loader, setLoader] = useState(false);
  const [apiError, setApiError] = useState({ error: false, message: "" });

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
      const res = await profileFactory.changePassword(data);
      toast.success(res.data.data);
      reset();
      if (isMobile) router.push("/settings");
    } catch (e) {
      setApiError({ error: true, ...e.response?.data });
    } finally {
      setLoader(false);
    }
  };

  const goBack = () => {
    router.push("/settings");
  };

  if (!profile) {
    return <div>Loading... </div>;
  }
  return (
    <div className="pt-18 md:pt-24 flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-200 text-gray-900 p-6 flex-col space-y-4 border-r border-gray-300">
        <h2 className="text-xl font-semibold">Settings</h2>
        <nav>
          <ul className="space-y-2">
            {settingsOptions.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.href}
                  className={`block p-2 rounded transition-all ${
                    activeItem === item.href
                      ? "bg-blue-500 text-white font-semibold"
                      : "hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveItem(item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:p-6 rounded-lg shadow-md">
        <div className="w-full md:w-4/5">
          <div className="ml-4 mr-4">
            <button
              onClick={goBack}
              className="py-4 md:hidden flex items-center text-blue-600 hover:text-blue-800 text-md font-medium"
            >
              <FiArrowLeft className="mr-1 h-5 w-5" />
              Back
            </button>
            <div className="p-4 mt-2 md:p-6 mx-auto bg-white rounded-lg drop-shadow-lg">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full md:w-1/2"
              >
                <div className="w-full">
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <PasswordInput
                        {...field}
                        type="password"
                        label="New Password"
                        placeholder="Enter Patient name"
                        className="w-full px-4 py-2 border rounded-lg"
                        error={error}
                        invalid={invalid}
                      />
                    )}
                  />
                </div>
                <div className="w-full mt-4 mb-4">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <PasswordInput
                        {...field}
                        type="password"
                        label="Confirm Passwrod"
                        placeholder="Enter Address"
                        className="w-full px-4 py-2 border rounded-lg"
                        error={error}
                        invalid={invalid}
                      />
                    )}
                  />
                </div>
                {apiError.error && (
                  <p className="text-red-500 text-xs mb-2">
                    {apiError.message}
                  </p>
                )}

                <div className="col-span-1 md:col-span-2">
                  <Button
                    isLoading={loader}
                    type="submit"
                    className="cursor-pointer w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
