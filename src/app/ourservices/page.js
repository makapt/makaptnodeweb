"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import service_pic1 from "@/assets/img/calendar.png";
import service_pic2 from "@/assets/img/stop-watch.png";
import service_pic3 from "@/assets/img/notification.png";
import service_pic4 from "@/assets/img/clock.png";
import { useApplicationContext } from "@/context/ApplicationContext";

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

const OurService = () => {
  const { isLoggedInUser } = useApplicationContext();
  return (
    <>
      <Head>
        <title>Makapt Services - Professional & Reliable Solutions</title>
        <meta
          name="description"
          content="Makapt Services provides top-notch professional solutions. Discover our services and experience seamless scheduling and superior service."
        />
        <meta
          name="keywords"
          content="Makapt, services, professional solutions, business services"
        />
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-16 px-8">
        <h1 className="text-4xl mt-8 font-bold">Welcome to Makapt Services</h1>
        <p className="mt-4 text-lg">
          Your trusted partner for professional and reliable solutions.
        </p>
        <Link href={isLoggedInUser ? "/find-doctors" : "/getstarted"}>
          <button className="cursor-pointer mt-6 bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-200">
            Get Started
          </button>
        </Link>
      </section>

      {/* Services Section */}
      <div
        className="container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden"
        id="services"
      >
        <h2 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
          Our{" "}
          <span className="underline underline-offset-4 decoration-1 under font-light">
            Services
          </span>
        </h2>
        <p className="text-center text-gray-500 mb-12 max-w-80 mx-auto">
          Seamless Scheduling, Superior Service
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {serviceData.map((project, index) => (
            <div
              key={index}
              className="max-w-[320px] border border-gray-200 shadow-lg rounded px-8 py-12 text-center"
            >
              <Image
                src={project.image}
                alt={project.title}
                width={50}
                height={50}
                className="mx-auto"
              />
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm mt-4">{project.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-3xl font-bold">Why Choose Makapt?</h2>
        <p className="text-gray-600 mt-4 mb-8">
          We provide industry-leading services tailored to your needs.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="bg-white shadow-md p-6 rounded-lg max-w-sm">
            <h3 className="text-lg font-semibold">Experienced Professionals</h3>
            <p className="text-gray-500 mt-2">
              Our team consists of highly skilled experts in the field.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg max-w-sm">
            <h3 className="text-lg font-semibold">Customer Satisfaction</h3>
            <p className="text-gray-500 mt-2">
              We prioritize customer satisfaction with quality service.
            </p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg max-w-sm">
            <h3 className="text-lg font-semibold">Affordable Pricing</h3>
            <p className="text-gray-500 mt-2">
              Our services come at competitive and transparent pricing.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold">What Our Clients Say</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <div className="bg-gray-100 shadow-md p-6 rounded-lg max-w-sm">
            <p className="text-gray-500">
              &quot;Makapt transformed our business operations. Highly
              recommended!&quot;
            </p>
            <span className="block mt-4 font-bold">- John Doe</span>
          </div>
          <div className="bg-gray-100 shadow-md p-6 rounded-lg max-w-sm">
            <p className="text-gray-500">
              &quot;Amazing service with quick responses and great
              support!&quot;
            </p>
            <span className="block mt-4 font-bold">- Sarah Lee</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-blue-50 py-16 text-center">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <div className="mt-6 mx-auto max-w-2xl text-left">
          <details className="border-b py-4">
            <summary className="cursor-pointer font-semibold text-gray-700">
              What services does Makapt offer?
            </summary>
            <p className="text-gray-600 mt-2">
              We provide a variety of professional services tailored to business
              needs.
            </p>
          </details>
          <details className="border-b py-4">
            <summary className="cursor-pointer font-semibold text-gray-700">
              How can I book a service?
            </summary>
            <p className="text-gray-600 mt-2">
              You can book a service through our website or contact our team
              directly.
            </p>
          </details>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white text-center py-12">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="mt-4">
          Contact us today and experience professional excellence.
        </p>
        <Link href="/contact">
          <button className="mt-6 bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-200 cursor-pointer">
            Contact Us
          </button>
        </Link>
      </section>
    </>
  );
};

export default OurService;
