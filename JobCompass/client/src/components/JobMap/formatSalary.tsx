/** format string salary range e.g. "$10/HR", "$10,000 - $20,000"
 *
 * the output is small enough to fit in a marker on a map
 */
export function formatSalary(salaryRange: string) {
  // case 1: "$10/HR" -> "$10/HR"
  const isDollarPerHr = salaryRange.includes("HR");
  if (isDollarPerHr) {
    const formattedSalary = salaryRange.split("/")[0]; // $10
    return formattedSalary;
  }

  // case 2: "$10,000 - $20,000" -> "$20K"
  const isSalary = salaryRange.includes(" - ") && !salaryRange.includes("/hour");
  if (isSalary) {
    // Get the second part of the range (after the dash)
    const parts = salaryRange.split(" - ");
    const secondPart = parts[1]; // "$20,000"
    
    // Extract the number without commas
    let formattedSalary = secondPart.split("$")[1]; // 20,000
    formattedSalary = formattedSalary.split(",")[0]; // 20
    formattedSalary = `$${formattedSalary}K`; // $20K

    return formattedSalary;
  }

  return `* ${salaryRange}`;
}
