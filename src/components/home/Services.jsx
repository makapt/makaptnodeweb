import Image from "next/image";

import service_pic1 from "@/assets/img/calendar.png";
import service_pic2 from "@/assets/img/stop-watch.png";
import service_pic3 from "@/assets/img/notification.png";
import service_pic4 from "@/assets/img/clock.png";

export const serviceData = [
  {
    title: "Online Doctor Appointments",
    desc: `Booking a doctor’s appointment has never been easier! At MAKAPT, you can quickly schedule an appointment with a variety of specialists, including general practitioners, pediatricians, dermatologists, and more. With just a few clicks, you can choose a time that fits your schedule—whether it’s for a routine check-up, a consultation, or a follow-up visit.`,
    image: service_pic1,
  },
  {
    title: "Same-Day Appointments",
    desc: "Got a sudden health concern? We offer same-day appointments for those in need of urgent care. Skip the long waiting times and book a consultation on the same day. Our team is committed to providing prompt and efficient care when you need it most.",
    image: service_pic2,
  },
  {
    title: "Appointment Reminders",
    desc: "Never forget your upcoming doctor’s visit! Our automated reminder system ensures that you receive timely notifications via text message or email. Whether it’s a scheduled appointment, follow-up, or prescription refill, we keep you informed, so you stay on top of your health.",
    image: service_pic3,
  },
  {
    title: "Flexible Scheduling",
    desc: "We understand that life can be busy. That’s why our online booking platform gives you the flexibility to choose a time that works best for you—no more waiting weeks for an appointment. With availability 24/7, you can schedule appointments at your convenience, whether it’s early in the morning, late in the evening, or on weekends.",
    image: service_pic4,
  },
];

const Services = () => {
  return (
    <div
      className="container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden"
      id="Services"
    >
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Our{" "}
        <span className="underline underline-offset-4 decoration-1 under font-light">
          Services
        </span>
      </h1>
      <p className="text-center text-gray-500 mb-12 max-w-80 mx-auto">
        Seamless Scheduling, Superior Service
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {serviceData.slice(0, 3).map((project, index) => (
          <div
            key={index}
            className="max-w-[320px] border border-gray-200 shadow-lg rounded px-8 py-12 text-center"
          >
            <Image
              src={project.image}
              alt={project.title}
              className="mx-auto"
              style={{ height: 50, width: 50 }}
            />
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {project.title}
              </h2>
              <p className="text-gray-500 text-sm mt-4">{project.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
