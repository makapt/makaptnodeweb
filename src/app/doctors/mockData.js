import appMockup from "@/assets/img/blank-profile-picture.png";

function getNextFiveDays() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const result = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i); // Get future dates
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" }); // Get short month name (e.g., Feb)

    if (i === 0) {
      result.push({ value: "Today", label: "Today", date_value: date });
    } else if (i === 1) {
      result.push({ value: "Tomorrow", label: "Tomorrow", date_value: date });
    } else {
      result.push({
        value: `${dayName} ${day} ${month}`,
        label: `${dayName} ${day} ${month}`,
        date_value: date,
      });
    }
  }
  result.unshift({ label: `Anytime`, label: `Anytime`, date_value: "anytime" });
  return result;
}

export const doctorsData = [
  {
    name: "Dr. John Doe",
    specialty: "General Physician",
    experience: "10 years",
    fees: "$50",
    rating: "4.5",
    location: "New York, USA",
    education: "MBBS, MD",
    image: appMockup,
  },
  {
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    experience: "12 years",
    fees: "$70",
    rating: "4.8",
    location: "Los Angeles, USA",
    education: "MBBS, DM",
    image: appMockup,
  },
  {
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    experience: "12 years",
    fees: "$70",
    rating: "4.8",
    location: "Los Angeles, USA",
    education: "MBBS, DM",
    image: appMockup,
  },
  {
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    experience: "12 years",
    fees: "$70",
    rating: "4.8",
    location: "Los Angeles, USA",
    education: "MBBS, DM",
    image: appMockup,
  },
  {
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    experience: "12 years",
    fees: "$70",
    rating: "4.8",
    location: "Los Angeles, USA",
    education: "MBBS, DM",
    image: appMockup,
  },
  {
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    experience: "12 years",
    fees: "$70",
    rating: "4.8",
    location: "Los Angeles, USA",
    education: "MBBS, DM",
    image: appMockup,
  },
  {
    name: "Dr. Jane Smith",
    specialty: "Cardiologist",
    experience: "12 years",
    fees: "$70",
    rating: "4.8",
    location: "Los Angeles, USA",
    education: "MBBS, DM",
    image: appMockup,
  },
];

export const filtersData = [
  {
    name: "Experience",
    value: "experience",
    options: [
      { label: "1-5 years", value: "1-5" },
      { label: "5-10 years", value: "5-10" },
      { label: "10-15 years", value: "10-15" },
      { label: "15+ years", value: "15+" },
    ],
  },
  {
    name: "Availability",
    value: "availability",
    options: getNextFiveDays(),
  },
  {
    name: "Fees",
    value: "fees",
    options: [
      { label: "₹0 - ₹500", value: "0-500" },
      { label: "₹500 - ₹1000", value: "500-1000" },
      { label: "₹1000 - ₹2000", value: "₹1000-₹2000" },
      { label: "Above ₹2000", value: "2000+" },
    ],
  },
  {
    name: "Gender",
    value: "gender",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
];
