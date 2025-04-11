"use client";
import { useState } from "react";
import LoginWithOTP from "./LoginWithOTP";
import LoginPassword from "./LoginPassword";

const ValidateNumber = ({ handlerNewUser, setMobile }) => {
  const [usePasswordLogin, setUsePasswordLogin] = useState(false);

  return (
    <div>
      {usePasswordLogin ? (
        <LoginPassword />
      ) : (
        <LoginWithOTP handlerNewUser={handlerNewUser} setMobile={setMobile} />
      )}

      <p
        className="text-center text-blue-600 mt-4 cursor-pointer"
        onClick={() => {
          setUsePasswordLogin(!usePasswordLogin);
        }}
      >
        {usePasswordLogin ? "Login using OTP" : "Login using password"}
      </p>
    </div>
  );
};

export default ValidateNumber;
