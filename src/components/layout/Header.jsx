"use client";

import { useEffect } from "react";
import Navbar from "./Navbar";
import { useSearchParams } from "next/navigation";
// import ScrollTop from "@/components/ScrollTop";

const Header = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("source");
    if (source === "qr") {
      handleAppRedirect();
    }
  }, [searchParams]);

  const handleAppRedirect = () => {
    const packageName = "com.makapt";
    const fallbackUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
    const intentUrl = `intent://makapt.com?source=qr#Intent;scheme=https;package=${packageName};end;`;

    const ua = navigator.userAgent;

    if (/android/i.test(ua)) {
      window.location.href = fallbackUrl;
      // window.location.href = intentUrl;
      // setTimeout(() => {
      //   window.location.href = fallbackUrl;
      // }, 1500);
    } else {
      console.log("Not an Android device");
    }
  };

  return (
    <div className="mb-16 md:mb-20 header-main" id="home">
      {/* <ScrollTop /> */}
      <Navbar />
    </div>
  );
};

export default Header;
