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
    <div className="mt-32 mb-10 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Get Started</h2>
      {newUser ? (
        <SignupInfo handlerNewUser={handlerNewUser} mobile={mobile} />
      ) : (
        <ValidateNumber handlerNewUser={handlerNewUser} setMobile={setMobile} />
      )}
    </div>
  );
};

export default GetStarted;
