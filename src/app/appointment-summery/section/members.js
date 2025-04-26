import { truncateName } from "@/utils/helper";
import Link from "next/link";
import React from "react";

export default function Members({ memberList, handlerMember }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
      {memberList.data.map((item, i) => {
        return (
          <div
            key={i}
            className={`cursor-pointer p-1 rounded-lg text-center w-[80px] 
                      ${
                        item.isDefault
                          ? "bg-[#fc9916] text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
            onClick={() => handlerMember(item._id)}
          >
            <p className="text-[12px]">{truncateName(item.patientName, 6)}</p>
            <p className="text-[10px] uppercase">
              {item.age}, {item.gender}
            </p>
          </div>
        );
      })}
      <div className="p-1 rounded-lg w-[80px] flex items-center justify-center">
        <Link
          href="/profile/members/add-member"
          className="cursor-pointer whitespace-nowrap text-blue-600 text-[12px]"
        >
          + Add Member
        </Link>
      </div>
    </div>
  );
}
