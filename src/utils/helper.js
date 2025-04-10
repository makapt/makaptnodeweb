const moment = require("moment");
export const businessName = "MAKAPT";

export const textLimit = (text, limit) => {
  if (text.length > limit) {
    let result = text.substr(0, limit);
    return result + " ...";
  } else {
    return text;
  }
};

export function formatNumber(num) {
  if (typeof num !== "number" || isNaN(num)) return "Invalid number";

  if (num >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";

  return num.toString();
}

export const renderSpecialist = (item, specialist) => {
  let text = "";
  if (specialist && specialist !== "doctorList") {
    item?.forEach((subitem, i) => {
      if (specialist === subitem._id) {
        text += subitem.name;
      }
    });
  } else {
    item?.forEach((subitem, i) => {
      text += (i !== 0 ? ", " : "") + subitem.name;
    });
  }
  return text;
};

export const renderEducation = (item) => {
  let text = "";

  item?.forEach((subitem, i) => {
    text += (i !== 0 ? ", " : "") + subitem.degree;
  });

  return text;
};

export function formatSchedule(schedules) {
  console.log("schedules", schedules);
  const today = moment().startOf("day");
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Create a map from given schedules
  const scheduleMap = schedules.reduce((acc, schedule) => {
    acc[schedule.days] = schedule.times.map((timeSlot) => ({
      from: moment(timeSlot.fromTime).format("hh:mm A"),
      to: moment(timeSlot.toTime).format("hh:mm A"),
    }));
    return acc;
  }, {});

  // Generate final output with all days included, starting from today
  const formattedSchedule = Array.from({ length: 7 }, (_, index) => {
    const scheduleDate = moment(today).add(index, "days"); // Ensures today is first
    const dayName = weekDays[scheduleDate.day()]; // Get correct day name

    let formattedDay;
    formattedDay = scheduleDate.format("ddd DD");

    return {
      label: formattedDay,
      date: scheduleDate.format("YYYY-MM-DD"),
      times: scheduleMap[dayName] || "Unavailable", // If day is missing, mark as unavailable
    };
  });

  return formattedSchedule;
}

export function formatAppointmentDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  return `${formattedDate} (${weekday})`;
}

export const truncateName = (name, maxLength = 10) => {
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
};

export function formatFullDate(date) {
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

const monthNames = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const shortweekdays = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

export const formattedDate = (data) => {
  let date = data;
  date = new Date(date);
  const day = shortweekdays[date.getDay()].label;
  const apptDate = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return day + " " + apptDate + " " + month + " , " + year;
};
