"use client";

import Image from "next/image";
import covid from "./img/covid.jpg";

const HealthBlog = () => {
  const latestNews = [
    {
      title: "COVID-19 Impact Will Last for Decades, Experts Warn",
      summary:
        "The long-term consequences of COVID-19 continue to shape healthcare systems worldwide, with experts predicting sustained challenges.",
      link: "https://www.bbc.com/news/health",
      image: covid,
    },
    {
      title: "New Study Links Diet to Mental Health Benefits",
      summary:
        "Research suggests that a Mediterranean diet can reduce the risk of depression and anxiety, promoting overall mental well-being.",
      link: "https://www.healthline.com/nutrition/mediterranean-diet-mental-health",
      image: covid,
    },
    {
      title: "Breakthrough in Cancer Research Offers New Hope",
      summary:
        "Scientists have developed a groundbreaking therapy that targets cancer cells more effectively, raising hopes for a future cure.",
      link: "https://www.science.org/cancer-research-breakthrough",
      image: covid,
    },
    {
      title: "WHO Reports Rise in Global Obesity Rates",
      summary:
        "A recent WHO report highlights an alarming increase in obesity rates worldwide, emphasizing the need for urgent action.",
      link: "https://www.who.int/news-room/obesity-rise",
      image: covid,
    },
    {
      title: "Regular Exercise Proven to Boost Brain Function",
      summary:
        "A new study confirms that physical activity improves memory, cognition, and reduces the risk of neurodegenerative diseases.",
      link: "https://www.medicalnewstoday.com/exercise-brain-health",
      image: covid,
    },
    {
      title: "The Future of Telemedicine: Healthcare at Your Fingertips",
      summary:
        "Telemedicine is transforming healthcare, making medical consultations more accessible and efficient than ever before.",
      link: "https://www.forbes.com/telemedicine-future",
      image: covid,
    },
  ];

  return (
    <div className="container mx-auto py-6 px-6">
      {/* Header Section */}
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Health & Wellness Blog
        </h1>
        <p className="text-gray-500 mt-2">
          Stay updated with the latest health news and tips.
        </p>
      </div>

      {/* Latest News Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {latestNews.map((news, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <Image
              src={news.image}
              alt={news.title}
              className="w-full h-56 object-cover"
              style={{ height: 250 }}
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {news.title}
              </h2>
              <p className="text-gray-600 mt-2">{news.summary}</p>
              <a
                href={news.link}
                target="_blank"
                className="inline-block mt-4 text-blue-600 font-medium hover:underline"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthBlog;
