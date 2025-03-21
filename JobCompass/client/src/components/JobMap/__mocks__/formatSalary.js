module.exports = {
  formatSalary: function(salaryRange) {
    // case 1: "$10/HR" -> "$10/HR"
    const isDollarPerHr = salaryRange.includes("HR");
    if (isDollarPerHr) {
      const formattedSalary = salaryRange.split("/")[0]; // $10
      return formattedSalary;
    }

    // case 2: "$10,000 - $20,000" -> "$20K"
    const isSalary = salaryRange.includes(" - ");
    if (isSalary) {
      let formattedSalary = salaryRange.split("$")[1]; // 20,000
      formattedSalary = formattedSalary.split(",")[0]; // 20
      formattedSalary = `$${formattedSalary}K`; // $20K

      return formattedSalary;
    }

    return `* ${salaryRange}`;
  }
};
