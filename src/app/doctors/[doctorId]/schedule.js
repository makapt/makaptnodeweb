import React from "react";

export default function Schedule({
  schedules,
  doctor,
  selectedTab,
  setSelectedTab,
  handleConfirmAppointment,
}) {
  return (
    <aside className="w-full md:w-[35%] bg-white p-4 rounded shadow border border-gray-300 h-fit">
      <div className="pb-2 relative border-b border-gray-300 bg-white flex items-center justify-between">
        <h2 className="text-md md:text-lg font-bold">Book Appointment</h2>
        <p className="font-bold text-md md:text-lg">
          ₹{doctor.data.doctor_financials[0].normalFee} fees
        </p>
      </div>

      {doctor && (
        <div className="">
          {/* Date Selection Tabs */}
          <div className="mt-4 border-b border-gray-300 pb-2 flex gap-2 overflow-x-auto">
            {schedules?.slice(0, 4).map((schedule, index) => {
              return (
                <button
                  key={index}
                  className={`px-4 py-2 rounded transition-colors ${
                    schedule?.times === "Unavailable"
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Lighter gray for disabled
                      : selectedTab === index
                      ? "bg-blue-500 text-white cursor-pointer" // Active button
                      : "bg-gray-100 text-gray-800 cursor-pointer" // Unselected button
                  }`}
                  disabled={schedule?.times === "Unavailable"}
                  onClick={() => {
                    if (schedule?.times !== "Unavailable") {
                      setSelectedTab(index);
                    }
                  }}
                >
                  <div className="w-10">{schedule.label}</div>
                </button>
              );
            })}
          </div>

          {schedules?.[selectedTab]?.times !== "Unavailable" &&
            schedules?.[selectedTab]?.times !== "Leave" && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Available Time</h3>
                <div className="grid grid-cols-1">
                  {schedules[selectedTab]?.times.map((newItem, j) => (
                    <div key={j} className="flex items-center gap-2 mb-4 mt-2">
                      <div className="font-medium">Shift {j + 1} : </div>
                      <button className="px-4 py-2 rounded transition-colors bg-gray-200">
                        {newItem.from} {" - "} {newItem.to}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          {schedules?.[selectedTab]?.times === "Leave" && (
            <div className="mt-6 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded">
              <h3 className="font-semibold text-lg mb-2">
                Doctor is on leave today
              </h3>
              {schedules[selectedTab]?.reason ? (
                <p>Reason: {schedules[selectedTab].reason}</p>
              ) : (
                <p>The doctor is not available for appointments today.</p>
              )}
            </div>
          )}
        </div>
      )}

      {schedules?.[selectedTab]?.times === "Leave" ? (
        <div className="mt-4 w-full px-4 py-2 bg-gray-400 text-white font-semibold rounded block text-center cursor-not-allowed">
          Appointment Closed
        </div>
      ) : (
        <button
          onClick={handleConfirmAppointment}
          className="cursor-pointer mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded text-lg font-medium"
        >
          Confirm Booking
        </button>
      )}
    </aside>
  );
}
