export const scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Use 'auto' for instant scroll
    });
  }
};
