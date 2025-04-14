/** format string salary range from various formats
 *
 * the output is small enough to fit in a marker on a map
 */
export function formatSalary(salaryRange: string) {
  // Handle "Not specified" case
  if (!salaryRange || salaryRange === "Not specified") {
    return "";
  }

  // Handle API format: "CAD52500 YEAR" -> "$52K"
  if (salaryRange.includes("YEAR") && !salaryRange.includes(" - ")) {
    // Extract currency and amount
    const match = salaryRange.match(/([A-Z]{3})(\d+)/);
    if (match) {
      const currency = match[1] === "CAD" ? "$" : match[1];
      const amount = parseInt(match[2]);
      // Format as K for thousands
      if (amount >= 1000) {
        return `${currency}${Math.floor(amount / 1000)}K`;
      }
      return `${currency}${amount}`;
    }
  }

  // Handle API format: "USD17.4 - USD70 HOUR" -> "$70/hr"
  if (salaryRange.includes("HOUR")) {
    if (salaryRange.includes(" - ")) {
      // Get the higher rate
      const parts = salaryRange.split(" - ");
      const secondPart = parts[1]; // "USD70 HOUR"
      const match = secondPart.match(/([A-Z]{3})(\d+\.?\d*)/);
      if (match) {
        const currency = match[1] === "CAD" ? "$" : match[1];
        const amount = match[2];
        return `${currency}${amount}/hr`;
      }
    } else {
      // Single hourly rate
      const match = salaryRange.match(/([A-Z]{3})(\d+\.?\d*)/);
      if (match) {
        const currency = match[1] === "CAD" ? "$" : match[1];
        const amount = match[2];
        return `${currency}${amount}/hr`;
      }
    }
  }

  // case 1: "$10/HR" -> "$10/HR" (original format)
  const isDollarPerHr = salaryRange.includes("/HR");
  if (isDollarPerHr) {
    const formattedSalary = salaryRange.split("/")[0]; // $10
    return formattedSalary;
  }

  // case 2: "$10,000 - $20,000" -> "$20K" (original format)
  const isSalary =
    salaryRange.includes(" - ") && !salaryRange.includes("/hour");
  if (isSalary) {
    try {
      // Get the second part of the range (after the dash)
      const parts = salaryRange.split(" - ");
      const secondPart = parts[1]; // "$20,000"

      // Extract the number without commas
      if (secondPart.includes("$")) {
        let formattedSalary = secondPart.split("$")[1]; // 20,000
        formattedSalary = formattedSalary.split(",")[0]; // 20
        formattedSalary = `$${formattedSalary}K`; // $20K
        return formattedSalary;
      }
    } catch (error) {
      console.log("Error formatting salary range:", salaryRange);
    }
  }

  // If we can't format it, return as is but shortened
  return salaryRange.length > 10
    ? salaryRange.substring(0, 10) + "..."
    : salaryRange;
}
