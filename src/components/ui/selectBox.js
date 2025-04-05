export default function SelectBox({
  options,
  label,
  error,
  invalid,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
          invalid ? "border-red-500" : "border-gray-300"
        } ${className}`}
      >
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {invalid && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
