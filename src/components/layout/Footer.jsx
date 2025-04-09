"use client";

import Link from "next/link";
import { useState } from "react";
import { businessName } from "@/utils/helper.js";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with ${email}!`);
      setEmail(""); // Reset input field
    } else {
      alert("Please enter a valid email.");
    }
  };

  return (
    <div
      className="pt-8 px-4 md:px-20 lg:px-32 bg-gray-900 text-white w-full overflow-hidden border-t border-gray-800"
      id="Footer"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Left Section - Company Info & Newsletter */}
        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-bold">{businessName}</h3>
          <p className="text-gray-400 mt-2">
            Empowering your journey with the latest insights.
          </p>

          {/* Newsletter Subscription */}
          <div className="mt-6">
            <h4 className="text-md font-semibold">
              Subscribe to Our Newsletter
            </h4>
            <p className="text-gray-400 text-sm">
              Get the latest updates directly to your inbox.
            </p>
            <div className="flex mt-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 w-full max-w-[250px] rounded-l-md focus:outline-none bg-white text-gray-900 border border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSubscribe}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-1/5">
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-gray-400">
            <Link href="/" className="hover:text-white cursor-pointer">
              Home
            </Link>
            <Link href="/about" className="hover:text-white cursor-pointer">
              About us
            </Link>
            <Link href="/blogs" className="hover:text-white cursor-pointer">
              Blog
            </Link>
            <Link href="/careers" className="hover:text-white cursor-pointer">
              Careers
            </Link>
            <Link href="/contact" className="hover:text-white cursor-pointer">
              Contact us
            </Link>
          </ul>
        </div>

        {/* Legal */}
        <div className="w-full md:w-1/5">
          <h3 className="text-lg font-bold mb-4">Legal</h3>
          <ul className="flex flex-col gap-2 text-gray-400">
            <Link href="/faqs" className="hover:text-white cursor-pointer">
              FAQs
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-white cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-conditions"
              className="hover:text-white cursor-pointer"
            >
              Terms & Conditions
            </Link>
          </ul>
        </div>

        {/* Social Links */}
        <div className="w-full md:w-1/5">
          <h3 className="text-lg font-bold mb-4">Follow Us</h3>
          <ul className="flex flex-col gap-2 text-gray-400">
            <a
              href="https://twitter.com"
              className="hover:text-white cursor-pointer"
            >
              Twitter (X)
            </a>
            <a
              href="https://www.facebook.com"
              className="hover:text-white cursor-pointer"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com"
              className="hover:text-white cursor-pointer"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com"
              className="hover:text-white cursor-pointer"
            >
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com"
              className="hover:text-white cursor-pointer"
            >
              YouTube
            </a>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-4 mt-10 text-center text-gray-400">
        Copyright 2025 © {businessName}. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
