export function formatRA(decimalHours) {
  if (decimalHours == null || isNaN(decimalHours)) return "—";

  let total = (decimalHours % 24 + 24) % 24;

  let hours = Math.floor(total);
  const totalMinutes = (total - hours) * 60;
  let minutes = Math.floor(totalMinutes);
  let seconds = Math.round((totalMinutes - minutes) * 60);

  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes === 60) {
    minutes = 0;
    hours = (hours + 1) % 24;
  }

  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  return `${h}h ${m}m ${s}s`;
}