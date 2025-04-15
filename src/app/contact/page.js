"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import apiFactory from "@/actions/apiAction";
import InfoModal from "./InfoModal";

const Contact = () => {
  const [result, setResult] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleClose = () => setFormSubmitted(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");

    const formData = new FormData(event.target);
    const object = Object.fromEntries(formData.entries());

    try {
      const response = await apiFactory.saveContactus(object);
      const data = response.data;

      if (data.success) {
        setResult("");
        setFormSubmitted(true);
        event.target.reset();
      } else {
        toast.error(data.message);
        setResult("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setResult("");
    }
  };

  return (
    <div
      className="container mx-auto p-6 md:px-20 lg:px-32 w-full overflow-hidden"
      id="contact"
    >
      <h1 className="text-2xl sm:text-4xl font-bold mb-6 mt-8 text-center">
        Contact With Us
      </h1>

      {formSubmitted && (
        <InfoModal
          handleClose={handleClose}
          content="Thank you for reaching out! We've received your message and will get back to you shortly."
        />
      )}

      <form
        onSubmit={onSubmit}
        className="max-w-2xl mx-auto text-gray-600 pt-8"
      >
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 text-left">
            <label className="block">Your Name</label>
            <input
              className="w-full border border-gray-300 rounded py-3 px-4 mt-2"
              type="text"
              name="name"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="w-full md:w-1/2 text-left md:pl-4">
            <label className="block">Your Number</label>
            <input
              className="w-full border border-gray-300 rounded py-3 px-4 mt-2"
              type="number"
              name="mobile"
              placeholder="Your Number"
              required
            />
          </div>
        </div>
        <div className="my-6 text-left">
          <label className="block">Your Email (optional)</label>
          <input
            className="w-full border border-gray-300 rounded py-3 px-4 mt-2"
            type="email"
            name="email"
            placeholder="Your Email"
          />
        </div>
        <div className="my-6 text-left">
          <label className="block">Message</label>
          <textarea
            className="w-full border border-gray-300 rounded py-3 px-4 mt-2 h-48 resize-none"
            name="message"
            placeholder="Message"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-12 mb-10 rounded cursor-pointer"
        >
          {result || "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;
