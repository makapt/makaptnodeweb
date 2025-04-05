const TextArea = ({ label, error, invalid, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        rows={2}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
          invalid ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {invalid && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default TextArea;
