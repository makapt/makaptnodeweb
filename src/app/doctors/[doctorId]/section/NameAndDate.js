import { dateDiff_SMH_full } from "@/utils/helper";
import React from "react";

export default function NameAndDate({ fullName, createdAt }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between">
      <p className="text-base font-semibold text-gray-800">
        {fullName} (Verified)
      </p>
      <p className="text-xs text-gray-500 mt-1 sm:mt-0">
        {dateDiff_SMH_full(createdAt)} ago
      </p>
    </div>
  );
}
