export default function DateOfBirthPicker({
  label,
  error,
  invalid,
  className = "",
  ...props
}) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type="date"
        max={today} // Prevent selecting future dates
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
          invalid ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {invalid && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
