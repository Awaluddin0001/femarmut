export function convertSecondsToReadable(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  let result = "";

  if (minutes > 0) {
    result += minutes + " Menit";
    if (minutes > 1) result += "s"; // pluralize if necessary
  }

  if (remainingSeconds > 0) {
    if (result !== "") result += " ";
    result += remainingSeconds + " Detik";
    if (remainingSeconds > 1) result += "s"; // pluralize if necessary
  }

  return result;
}
