"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import doctorFactory from "@/actions/doctorAction";
import profileFactory from "@/actions/profileAction";
import Members from "./section/members";
import LeftSection from "./section/LeftSection";
import Link from "next/link";
import appointmentFactory from "@/actions/appointmentAction";
import { useSearchParams } from "next/navigation";
import { FiLoader } from "react-icons/fi";

export default function AppointmentSummery() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const specialist = searchParams.get("specialist");
  const apptdate = searchParams.get("apptdate");

  const [doctor, setDoctor] = useState(null);
  const [memberList, setMemberList] = useState({ data: [], total: 0 });
  const [btnClicked, setBtnClicked] = useState(false);
  const [loader, setLoader] = useState(false);

  const fetchData = useCallback(async () => {
    const result = await doctorFactory.apptSummaryDetail(id);
    setDoctor(result.data);
    const members = await profileFactory.getMember();
    setMemberList(members.data);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => console.error("Failed to load Razorpay script");
      document.body.appendChild(script);
    });
  };

  const handlerMember = (id) => {
    let newState = [...memberList.data];
    newState = newState.map((subItem) => {
      if (subItem._id === id) {
        return { ...subItem, isDefault: true };
      } else {
        return { ...subItem, isDefault: false };
      }
    });
    setMemberList({ ...memberList, data: newState });
  };

  const selectedPatient = () => {
    let newState = [...memberList.data];
    return (newState = newState.filter((subItem) => subItem.isDefault)[0]);
  };

  const serviceFees = () => {
    const data = doctor.data;
    const appointmentFee = data?.doctor_financials[0]?.normalFee;

    const commissionPercentage =
      data?.doctor_financials[0]?.platformServiceCharges;

    const commissionAmount = (appointmentFee * commissionPercentage) / 100;
    const totalServiceFee = Math.round(commissionAmount);
    return totalServiceFee;
  };

  function generateToken() {
    const expiryTime = Date.now() + 5 * 60 * 1000;
    const token = `${expiryTime}`;
    return btoa(token);
  }

  const handlePayment = async () => {
    if (btnClicked) return; // Prevent double-click

    setBtnClicked(true); // ✅ Immediately disable the button

    let selectedMem = [...memberList.data];
    selectedMem = selectedMem.filter((item) => item.isDefault)[0];

    if (!selectedMem) {
      alert("Please select patient");
      setBtnClicked(false); // Re-enable button
      return;
    }

    const payload = {
      appointmentDate: new Date(apptdate),
      patientInfo: selectedMem,
      doctorId: id,
      specialist: specialist,
      couponCode: null,
      createdBy: "user",
      paymentSource: "online",
      apptSource: "web",
      apptType: doctor.data.apptType,
      tax_service_charge: serviceFees(),
    };

    try {
      const amount = serviceFees();
      const response = await appointmentFactory.createOrder({
        amount,
        doctorId: id,
      });

      const { orderId } = response.data;

      const options = {
        key: "rzp_test_DjVr1Ol8Y7pYaK",
        amount: amount,
        currency: "INR",
        name: "MAKAPT",
        description: "Doctor Consultation Fee",
        order_id: orderId,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          const token = generateToken();

          try {
            setLoader(true);
            await appointmentFactory.verifyOrderCreateAppt({
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              signature: razorpay_signature,
              ...payload,
            });
            router.push(
              "/payment-confiramtion?status=success&oid=" +
                razorpay_order_id +
                "&token=" +
                token
            );
          } catch (error) {
            router.push(
              "/payment-confiramtion?status=failed&oid=" +
                razorpay_order_id +
                "&token=" +
                token
            );
          } finally {
            setLoader(false);
          }
        },
        modal: {
          ondismiss: function () {
            setBtnClicked(false);
          },
        },
        prefill: {
          name: "Patient Name",
          email: "patient@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#fc9916",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment setup:", error);
      setBtnClicked(false); // ✅ Re-enable button on failure
    }
  };

  useEffect(() => {
    if (loader) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [loader]);

  return (
    <div className="relative min-h-screen bg-gray-100 p-4">
      {/* Main Content */}

      {loader && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            backgroundColor: "oklch(0.97 0 0 / 0.77)",
            overflow: "hidden",
          }}
        >
          <div className="bg-white p-4 rounded-full shadow-md">
            <FiLoader className="animate-spin text-2xl text-gray-700" />
          </div>
        </div>
      )}

      {doctor && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Doctor Profile Section (Left - 40%) */}
          <LeftSection doctor={doctor} apptdate={apptdate} />

          {/* Right Side - Select Member & Other Info (60%) */}
          <div className="bg-white p-4 rounded shadow-md md:col-span-3">
            {/* Select Member Section */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Select Member</h3>
              <p className="text-gray-600">Who is the patient?</p>
              <p className="text-gray-500 text-sm mb-3">
                Make sure to add valid patient details, it will be reflected on
                Prescription and Invoice
              </p>
              <Members memberList={memberList} handlerMember={handlerMember} />
            </div>

            {/* Patient's Contact Number */}
            {selectedPatient() && (
              <div className="mb-5">
                <h3 className="text-lg font-semibold mb-2">Selected Patient</h3>

                <div className="p-2 rounded-lg w-full border-1 border-[#fc9916]">
                  <p className="text-sm">{selectedPatient().patientName}</p>
                  <p className="text-sm mb-1 capitalize">
                    {selectedPatient().mobile} • {selectedPatient().age} years •{" "}
                    {selectedPatient().gender}
                  </p>

                  <p className="text-xs">{selectedPatient().address}</p>
                </div>
              </div>
            )}

            {/* Payment Details Section */}
            <div className="mb-4 border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">
                Total Charges Breakdown
              </h3>

              {/* Consultation Fee */}
              <div className="flex justify-between text-gray-600">
                <p>
                  <span className="text-black text-[16px] block">
                    Consult Fee{": "}
                  </span>

                  <span className="text-blue-600 text-[12px] font-semibold block">
                    Pay directly to the doctor
                  </span>
                </p>
                <p className="font-medium font-semibold text-black">
                  ₹{doctor.data.doctor_financials[0].normalFee}
                </p>
              </div>

              {/* Booking Fee */}
              <div className="flex justify-between text-gray-600 mt-2">
                <p>
                  <span className="text-black text-[16px] block">
                    Booking Fee & Tax{": "}
                  </span>
                  <span className="text-blue-600 text-[12px] font-semibold block">
                    Pay now to confirm your appointment
                  </span>
                </p>
                <p className="font-medium font-semibold text-black">
                  ₹{serviceFees()}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t my-3"></div>

              {/* Total Amount to Pay Now */}
              <div className="flex justify-between text-lg font-bold">
                <p>Total to Pay Now:</p>
                <p className="">₹{serviceFees()}</p>
              </div>

              {/* Terms & Policies */}
              <p className="text-gray-500 text-sm mt-3">
                By booking this appointment, you agree to our{" "}
                <Link
                  href="/terms-conditions"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Terms & Conditions
                </Link>
                ,{" "}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Privacy Policy
                </Link>
                , and{" "}
                <Link
                  href="/faqs"
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Refund Policy
                </Link>
                .
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={btnClicked}
              className={`cursor-pointer w-full text-sm font-semibold mt-4 px-4 py-2 rounded-lg transition-all flex items-center justify-center ${
                btnClicked
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {btnClicked ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Processing Payment...
                </>
              ) : (
                <>Pay ₹{serviceFees()} to Confirm Booking</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
