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
      className="bg-gray-900 text-white w-full overflow-hidden border-t border-gray-800 pt-10 px-4 md:px-10 lg:px-32"
      id="Footer"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <Link href="/about" className="hover:text-white">
                About us
              </Link>
              <Link href="/blogs" className="hover:text-white">
                Blog
              </Link>
              <Link href="/careers" className="hover:text-white">
                Careers
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact us
              </Link>
            </ul>
          </div>

          {/* For Doctor */}
          <div>
            <h3 className="text-lg font-bold mb-4">For Doctor</h3>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              <a
                target="_blank"
                href="https://partner.makapt.com"
                className="hover:text-white"
              >
                Makapt Profile
              </a>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              <Link href="/faqs" className="hover:text-white">
                FAQs
              </Link>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-white">
                Terms & Conditions
              </Link>
              <Link href="/ourservices" className="hover:text-white">
                Services
              </Link>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <ul className="flex flex-col gap-2 text-gray-400 text-sm">
              <a href="https://twitter.com" className="hover:text-white">
                Twitter (X)
              </a>
              <a href="https://www.facebook.com" className="hover:text-white">
                Facebook
              </a>
              <a href="https://www.instagram.com" className="hover:text-white">
                Instagram
              </a>
              <a href="https://www.linkedin.com" className="hover:text-white">
                LinkedIn
              </a>
              <a href="https://www.youtube.com" className="hover:text-white">
                YouTube
              </a>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-4 text-center text-sm text-gray-400">
          © 2025 {businessName}. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
