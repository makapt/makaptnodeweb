"use client";

import { createContext, useContext, useState, useEffect } from "react";

import authFactory from "@/actions/authAction";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const ApplicationContext = createContext();

const Provider = ({ children }) => {
  const [isLoggedInUser, setLoggedInUser] = useState(false);
  const [accounts, setAccounts] = useState(null);

  const login = (token, redirectionURL) => {
    cookies.set("__mtoken", token, {
      path: "/",
    });
    window.location.href = redirectionURL || "/";
  };

  const handlerLogout = () => {
    try {
      setAccounts(null);
      cookies.remove("__mtoken", { path: "/" });
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (e) {
      console.log("logouterror", e);
    }
  };

  const fetchAccountInfo = async () => {
    const res = await authFactory.accounts();
    setAccounts(res.data.data[0]);
  };

  useEffect(() => {
    const token = cookies.get("__mtoken");
    setLoggedInUser(!!token);
    if (token) fetchAccountInfo();
  }, []);

  return (
    <ApplicationContext.Provider
      value={{
        accounts,
        isLoggedInUser,
        handlerLogout,
        login,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

const ApplicationContextProvider = ({ children }) => (
  <Provider>{children}</Provider>
);

export default ApplicationContextProvider;

export const useApplicationContext = () => useContext(ApplicationContext);
