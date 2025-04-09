"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle, FaCreditCard, FaTimesCircle } from "react-icons/fa";
import appointmentFactory from "@/actions/appointmentAction";

const PaymentConfirmationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [details, setDetails] = useState(null);

  const orderId = searchParams.get("oid");
  const paymentStatus = searchParams.get("status");
  const token = searchParams.get("token");

  const getDetails = async () => {
    try {
      const res = await appointmentFactory.getOrderInfo(orderId);
      setDetails(res.data.data);
    } catch (error) {
      console.error("Error fetching order details", error);
    }
  };

  function decodeToken(token) {
    const decoded = atob(token);
    return parseInt(decoded, 10);
  }

  useEffect(() => {
    if (!token) {
      alert("Invalid link.");
      router.push("/profile");
      return;
    }

    const expiryTime = decodeToken(token);
    const currentTime = Date.now();

    if (currentTime > expiryTime) {
      alert("The link has expired. Please request a new one.");
      router.push("/profile");
    } else {
      getDetails();
    }
  }, [router, token]);

  return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <h3 className="text-lg md:text-3xl font-semibold text-center mb-6">
        {paymentStatus === "success"
          ? "Payment Successful!"
          : "Payment Failed!"}
      </h3>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        {paymentStatus === "success" ? (
          <div className="text-center">
            <FaCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Thank you for your payment</p>
            <p className="text-gray-700 mt-4">
              Your platform fees have been successfully transferred. We
              appreciate your continued partnership!
            </p>
            {details && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Amount Paid:</p>
                  <p className="font-medium">₹{details.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method:</p>
                  <p className="font-medium uppercase">
                    {details.payment_method}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <FaTimesCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Oops! Something Went Wrong!</p>
            <p className="text-gray-700 mt-4">
              Your payment didn’t go through. Please check your details and try
              again.
            </p>
            {details && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Amount Failed:</p>
                  <p className="font-medium">₹{details.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method:</p>
                  <p className="font-medium uppercase">
                    {details.payment_method}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() =>
              router.push(`/profile/appointments/${details?.appt_ID}`)
            }
            className="cursor-pointer w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            <FaCreditCard className="w-5 h-5 mr-2" /> View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;
