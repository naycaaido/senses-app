const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

const normalizeScheduleDate = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && DATE_PATTERN.test(value)) {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (!Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value) {
      return value;
    }
  }

  throw new Error("Invalid schedule date; expected a valid YYYY-MM-DD value");
};

const normalizeScheduleTime = (value) => {
  let time = value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    time = value.toISOString().slice(11, 19);
  }

  if (typeof time === "string") {
    const match = TIME_PATTERN.exec(time);
    if (match) {
      const [, hours, minutes, seconds = "00"] = match;
      return `${hours}:${minutes}:${seconds}`;
    }
  }

  throw new Error("Invalid schedule time; expected a valid HH:MM or HH:MM:SS value");
};

const scheduleStartAtWib = (tanggal, jamMulai) => {
  const date = normalizeScheduleDate(tanggal);
  const time = normalizeScheduleTime(jamMulai);
  const startAt = new Date(`${date}T${time}+07:00`);

  if (Number.isNaN(startAt.getTime())) {
    throw new Error("Invalid schedule start date/time for WIB conversion");
  }

  return startAt;
};

export { scheduleStartAtWib };
