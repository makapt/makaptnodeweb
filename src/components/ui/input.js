import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const PasswordInput = ({
  label,
  error,
  invalid,
  className = "",
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const inputType = isPasswordField && !showPassword ? "password" : "text";

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <input
        type={inputType}
        className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
          invalid ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />

      {isPasswordField && (
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[35px] cursor-pointer text-gray-500"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>
      )}

      {invalid && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default PasswordInput;
