export type TimerResult = {
  hours: string;
  minutes: string;
  seconds: string;
  status: "upcoming" | "live" | "ended";
};

/* =====================================================
   SAFE LOCAL DATE BUILDER
===================================================== */

const buildLocalDate = (dateTime: string) => {
  // expected: "YYYY-MM-DDTHH:mm" OR "YYYY-MM-DD HH:mm"
  const [datePart, timePart] = dateTime.replace("T", " ").split(" ");

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, 0, 0);
};

/* =====================================================
   TIMER ENGINE (FIXED)
===================================================== */

export const getRemainingTime = (
  startTime: string,
  endTime: string
): TimerResult => {

  const now = new Date().getTime();

  /* ✅ LOCAL SAFE DATES */
  const start = buildLocalDate(startTime).getTime();
  const end = buildLocalDate(endTime).getTime();

  const pad = (n: number) => String(n).padStart(2, "0");

  /* ================= UPCOMING ================= */
  if (now < start) {
    const diff = start - now;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return {
      hours: pad(h),
      minutes: pad(m),
      seconds: pad(s),
      status: "upcoming",
    };
  }

  /* ================= LIVE ================= */
  if (now >= start && now <= end) {
    const diff = end - now;

    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return {
      hours: "00",
      minutes: pad(m),
      seconds: pad(s),
      status: "live",
    };
  }

  /* ================= ENDED ================= */
  return {
    hours: "00",
    minutes: "00",
    seconds: "00",
    status: "ended",
  };
};