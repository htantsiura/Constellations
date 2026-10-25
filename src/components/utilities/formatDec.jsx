export function formatDec(decimalDegrees) {
  if (decimalDegrees == null || isNaN(decimalDegrees)) return "—";

  const sign = decimalDegrees >= 0 ? "+" : "-";
  let absVal = Math.abs(decimalDegrees);

  let degrees = Math.floor(absVal);
  const totalMinutes = (absVal - degrees) * 60;
  let minutes = Math.floor(totalMinutes);
  let seconds = Math.round((totalMinutes - minutes) * 60);

  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }
  if (minutes === 60) {
    minutes = 0;
    degrees += 1;
  }

  const d = String(degrees).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  return `${sign}${d}° ${m}′ ${s}″`;
}