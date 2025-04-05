import React from "react";
import appMockup from "@/assets/img/blank-profile-picture.png";
import Image from "next/image";

export default function CacheImage({ path, src, ...rest }) {
  const imageSrc = src ? `${path}${src}` : appMockup;

  return (
    <Image
      {...rest}
      src={imageSrc}
      alt="Doctor Image"
      className="rounded-full mb-4"
      unoptimized={!!src} // Optimize local images but allow external images without Next.js optimization
    />
  );
}
