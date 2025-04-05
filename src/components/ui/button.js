const Button = ({
  variant = "primary",
  className = "",
  isLoading = false,
  children,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none flex items-center justify-center gap-2";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white disabled:border-gray-400 disabled:text-gray-400",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || props.disabled} // Disable when loading
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"
          ></path>
        </svg>
      )}
      {!isLoading && children}
    </button>
  );
};

export default Button;
