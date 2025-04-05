import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import apiFactory from "../../actions/apiAction";
import { imgPath } from "../../service/axiosInstance";
import { textLimit } from "../../utils/helper";
import { useNavigate } from "react-router";

const Blog = () => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({ data: [], status: "error" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);

  const getBlogList = async () => {
    const res = await apiFactory.getBlogs();
    setBlogData(res.data);
  };

  useEffect(() => {
    getBlogList();
  }, []);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(blogData.length);
      } else {
        setCardsToShow(1);
      }
    };
    updateCardsToShow();

    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const nextProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % blogData.length);
  };
  const prevProject = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? blogData.length - 1 : prevIndex - 1
    );
  };

  return (
    <div
      className="container mx-auto p-14 md:px-20 lg:px-32 w-full overflow-hidden"
      id="Blog"
    >
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-center">
        Latest{" "}
        <span className="underline underline-offset-4 decoration-1 under font-light">
          News
        </span>
      </h1>
      <p className="text-center text-gray-500 mb-8 max-w-80 mx-auto">
        Crafting Spaces, Building Legacies—Explore Our Portfolio
      </p>

      {/* slider buttons */}

      <div className="flex justify-end items-center mb-8">
        <button
          onClick={prevProject}
          className="p-3 bg-gray-200 rounded mr-2"
          aria-label="Previous Project"
        >
          <img src={assets.left_arrow} alt="Previous" />
        </button>
        <button
          onClick={nextProject}
          className="p-3 bg-gray-200 rounded mr-2"
          aria-label="Next Project"
        >
          <img src={assets.right_arrow} alt="Next" />
        </button>
      </div>

      {/* project slider container */}
      <div className="overflow-hidden">
        <div
          className="flex gap-8 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)`,
          }}
        >
          {blogData?.data?.map((project, index) => (
            <div key={index} className="flex-shrink-0 w-full sm:w-1/3">
              <img
                src={imgPath + "banners/" + project.blogImg}
                alt={project.title}
                style={{ height: 220 }}
                className="w-full h-auto"
              />
              <div className="flex justify-center">
                <div className="inline-block">
                  <h2 className="text-xl font-semibold text-gray-800 mt-3">
                    {project.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-3">
                    {textLimit(project.desc, 340)}
                  </p>
                  {project?.desc?.length > 340 && (
                    <button
                      onClick={() => {
                        navigate("/blog?blogId=" + project._id);
                      }}
                      className="mt-4 text-sm md:block bg-white px-6 py-2 rounded-full border"
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
