import React from "react";

export default function PatientDetail({ data }) {
  return (
    <div className="mt-4 w-full bg-white p-6 rounded shadow border border-gray-300">
      <div className="bg-white flex items-center">
        <h2 className="text-base font-semibold flex-1">Patient Detail</h2>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-semibold">Full Name:</p>
          <p className="text-sm text-gray-900">
            {data.patientInfo.patientName}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Age:</p>
          <p className="text-sm text-gray-900">{data.patientInfo.age} yrs</p>
        </div>

        <div>
          <p className="text-sm font-semibold">Gender:</p>
          <p className="text-sm text-gray-900 capitalize">
            {data.patientInfo.gender}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Phone:</p>
          <p className="text-sm text-gray-900">{data.patientInfo.mobile}</p>
        </div>

        <div className="col-span-2">
          <p className="text-sm font-semibold">Address:</p>
          <p className="text-sm text-gray-900">{data.patientInfo.address}</p>
        </div>
      </div>
    </div>
  );
}
