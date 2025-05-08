export const checkAvailability = (schedule) => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  if (schedule.date === todayStr) {
    // Get the last time slot's 'to' time
    const lastToTimeStr = schedule.times[schedule.times.length - 1].to;
    const lastToDate = new Date(`${schedule.date} ${lastToTimeStr}`);

    if (lastToDate < today) {
      return { availability: false };
    }
  }
  return { availability: true };
};
