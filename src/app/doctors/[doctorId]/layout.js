function extractDoctorName(slug) {
  const parts = slug.split("-");
  const nameParts = parts.slice(0, parts.length - 1); // Remove the ID
  const capitalized = nameParts.map((cap) => {
    if (cap === "dr") return "Dr.";
    return cap.charAt(0).toUpperCase() + cap.slice(1);
  });
  return capitalized.join(" ");
}

export function generateMetadata({ params }) {
  const slug = params.doctorId;
  const doctorName = extractDoctorName(slug);
  return {
    title: `${doctorName} | Makapt`,
    description: `Book an appointment with ${doctorName} on Makapt. View profile, availability, and clinic location.`,
  };
}

export default function DoctorLayout({ children }) {
  return <>{children}</>;
}
