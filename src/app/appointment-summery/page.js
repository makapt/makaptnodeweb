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
import { Dialog } from "@headlessui/react";
import { FaExclamationTriangle } from "react-icons/fa";
import moment from "moment-timezone";

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
  const [isOpen, setOpen] = useState(false);
  const [isLimitFull, setLimitFull] = useState(false);

  const fetchData = useCallback(async () => {
    // const patientLimit = await appointmentFactory.checkPatientLimit({
    //   doctorId: id,
    //   appointmentDate: new Date(apptdate),
    //   source: "page-reload",
    // });
    // setLimitFull(patientLimit.data.isFull);
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
    if (btnClicked) return;

    setBtnClicked(true);

    let selectedMem = [...memberList.data];
    selectedMem = selectedMem.filter((item) => item.isDefault)[0];

    if (!selectedMem) {
      alert("Please select patient");
      setBtnClicked(false);
      return;
    }

    const utcDate = moment.tz(`${apptdate} 00:00`, "Asia/Kolkata").toDate();

    const payload = {
      appointmentDate: utcDate,
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
        ...payload,
      });

      const { orderId, fullName, mobile, email } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: "INR",
        name: "MAKAPT",
        description: "Doctor Consultation Fee",
        order_id: orderId,
        handler: async function (response) {
          const { razorpay_order_id } = response;
          const token = generateToken();

          try {
            setLoader(true);
            await appointmentFactory.verifyOrderCreateAppt({
              orderId: razorpay_order_id,
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
          ondismiss: async function () {
            await appointmentFactory.transactionFailed({
              orderId: orderId,
            });
            setBtnClicked(false);
          },
        },
        prefill: {
          name: fullName,
          email: mobile,
          contact: email,
        },
        theme: {
          color: "#fc9916",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment setup:", error);
      setBtnClicked(false);
      if (error.status === 400) setOpen(true);
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

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-100 p-4">
      {isLimitFull && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6">
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 font-semibold">
            Appointment slots are currently full. Please try again later or
            choose a different time.
          </div>
        </div>
      )}

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
              disabled={btnClicked || isLimitFull}
              className={`w-full text-sm font-semibold mt-4 px-4 py-2 rounded-lg transition-all flex items-center justify-center ${
                btnClicked || isLimitFull
                  ? "bg-blue-300 text-gray-500 cursor-not-allowed"
                  : "cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
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
            {isLimitFull && (
              <p className="text-base text-red-600 mt-2 font-semibold">
                Appointment slots are currently full. Please try again later or
                choose a different time.
              </p>
            )}
          </div>
        </div>
      )}

      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/25" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Just use a div instead of Dialog.Panel if needed */}
            <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <FaExclamationTriangle className="h-6 w-6 text-red-500" />

                <h2 className="text-lg font-semibold text-gray-900">
                  Appointment Unavailable
                </h2>
              </div>
              <div className="text-gray-700">
                <p className="font-semibold">
                  The doctor has already reached their appointment limit for the
                  selected day.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Please choose another available date to schedule your
                  appointment.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    onClose();
                    router.back();
                  }}
                  className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
