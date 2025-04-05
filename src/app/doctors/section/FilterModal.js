"use client";
import { Dialog } from "@headlessui/react";
import { filtersData } from "../mockData";
import { useSearchParams } from "next/navigation";

export default function FilterModal({ filterHandler, isOpen, setIsOpen }) {
  const searchParams = useSearchParams();

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal - Positioned at Bottom for Mobile */}
      <div className="fixed inset-x-0 bottom-0 bg-white w-full max-w-md md:w-3/4 rounded-t-lg shadow-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white">
          <h2 className="text-lg font-semibold">Filters & Sort</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-black"
          >
            ❌
          </button>
        </div>

        {/* Filters - Scrollable Section */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <div className="mb-4 flex flex-wrap gap-2">
            {filtersData.map((filter) => {
              const selectedValue = searchParams.get(filter.value);
              if (!selectedValue) return null;

              let selectedOption;
              selectedOption = filter.options.find(
                (option) => option.value === selectedValue
              );
              return selectedOption ? (
                <div
                  key={filter.value}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {selectedOption.label}
                  <button
                    onClick={() => {
                      filterHandler(filter.value, "", "");
                      setIsOpen(false);
                    }}
                    className="cursor-pointer ml-2 text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>
              ) : null;
            })}
          </div>
          {filtersData.map((filter, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium text-gray-700">{filter.name}</h3>
              <div className="mt-2 space-y-2">
                {filter.options.map((option, idx) => {
                  const isChecked =
                    searchParams.get(filter.value) === option.value;
                  return (
                    <label
                      onClick={() => {
                        filterHandler(
                          filter.value,
                          option.value,
                          option.date_value
                        );
                        setIsOpen(false);
                      }}
                      key={idx}
                      className="block text-sm"
                    >
                      <input
                        type="radio"
                        name={filter.value}
                        className="cursor-pointer mr-2"
                        checked={isChecked || false}
                        onChange={() => {}}
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white flex gap-4">
          <button
            onClick={() => setIsOpen(false)}
            className="w-1/2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-1/2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      </div>
    </Dialog>
  );
}
