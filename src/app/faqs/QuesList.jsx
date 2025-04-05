"use client";

import { useState } from "react";

export default function Accordion({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {data?.map((section, sectionIndex) => (
        <div key={section.categoryValue}>
          {/* Section Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {section.categoryValue}
          </h2>

          {section.items?.map(({ _id, question, answer }, itemIndex) => (
            <div key={_id} className="border-b">
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(`${sectionIndex}-${itemIndex}`)}
                className="flex justify-between w-full py-3 text-lg font-medium text-gray-700 focus:outline-none"
              >
                {question}
                <span
                  className={`transform transition-transform ${
                    openIndex === `${sectionIndex}-${itemIndex}`
                      ? "rotate-180"
                      : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Accordion Body */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === `${sectionIndex}-${itemIndex}`
                    ? "max-h-96 opacity-100 py-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className="text-gray-600 px-4 pb-3"
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
