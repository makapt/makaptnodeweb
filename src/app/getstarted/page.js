"use client";
import { useState } from "react";
import ValidateNumber from "./ValidateNumber";
import SignupInfo from "./SignupInfo";

const GetStarted = () => {
  const [newUser, setNewUser] = useState(false);
  const [mobile, setMobile] = useState("");

  const handlerNewUser = (status) => {
    setNewUser(status);
  };

  return (
    <div className="mt-0 md:mt-28 mb-10 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Get Started</h2>
      <p className="text-gray-600 text-center mb-6">
        {newUser
          ? "Enter your personal details to continue"
          : "Enter your mobile number to continue"}
      </p>
      {newUser ? (
        <SignupInfo handlerNewUser={handlerNewUser} mobile={mobile} />
      ) : (
        <ValidateNumber handlerNewUser={handlerNewUser} setMobile={setMobile} />
      )}
      <p className="text-center text-sm text-gray-600 mt-5">
        By clicking Continue, you agree to MAKAPT’s
        <a href="#" className="text-blue-600">
          {" "}
          Privacy Policy
        </a>
        ,
        <a href="#" className="text-blue-600">
          {" "}
          Terms and Conditions
        </a>
        .
      </p>
    </div>
  );
};

export default GetStarted;
