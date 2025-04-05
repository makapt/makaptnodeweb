import AndroidIcon from "@/assets/icons/androidIcon.jsx";
import Image from "next/image";
import appMockup from "@/assets/img/app-mobile.png";

export default function DownloadApp() {
  return (
    <section className="w-full bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8 rounded-xl">
        {/* Left Side - Mobile App Mockup */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={appMockup}
            alt="Makapt App Mockup"
            width={250}
            height={300}
            className="object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Right Side - Download Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Download the Makapt App
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Book appointments easily and connect with doctors anytime, anywhere.
          </p>

          {/* Input Field for Phone Number */}
          <div className="mt-4 flex items-center border border-gray-300 rounded-lg overflow-hidden w-full md:w-3/4">
            <input
              type="text"
              placeholder="Enter your phone number"
              className="px-4 py-3 w-full outline-none"
            />
            <button className="bg-blue-600 text-white px-5 py-3 font-medium hover:bg-blue-700 w-[150px]">
              Get Link
            </button>
          </div>

          {/* Download Buttons */}
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <a
              href="https://play.google.com/store/apps/details?id=com.makapt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-lg hover:bg-gray-800"
            >
              <AndroidIcon width={20} height={20} />
              <span>Google Play</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-lg hover:bg-gray-800"
            >
              <svg
                width="20"
                height="20"
                fill="white"
                viewBox="0 0 384 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M320 99.3C293.5 99.3 263.8 118 250.2 118s-36.4-18.3-59.5-18.3c-48.5 0-104.9 38-104.9 137.8s63.3 194.2 100.3 194.2c20.2 0 30.4-13.2 59.2-13.2 29.2 0 37.6 13.2 60 13.2 37.5 0 99.7-100 99.7-190.8 0-136.8-80-141.6-84.9-141.6zM248 46.8C268.1 24 273.8 0 273.8 0s-27.5 1.5-48.9 18.7c-20.5 16.4-29 35.7-27.3 55.4 20.9 1.7 41.8-7.6 50.4-18.1z" />
              </svg>
              <span>App Store</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
