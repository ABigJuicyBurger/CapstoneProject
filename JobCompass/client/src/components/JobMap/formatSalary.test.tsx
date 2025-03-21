// Define the formatSalary function directly in the test file
function formatSalary(salaryRange: string) {
  // case 1: "$10/HR" -> "$10/HR"
  const isDollarPerHr = salaryRange.includes("HR");
  if (isDollarPerHr) {
    const formattedSalary = salaryRange.split("/")[0]; // $10
    return formattedSalary;
  } 

  // case 2: "$10,000 - $20,000" -> "$20K"
  const isSalary = salaryRange.includes(" - ");
  if (isSalary) {
    let formattedSalary = salaryRange.split("$")[2] || salaryRange.split("$")[1]; // 20,000
    formattedSalary = formattedSalary.split(",")[0]; // 20
    formattedSalary = `$${formattedSalary}K`; // $20K

    return formattedSalary;
  }

  return `* ${salaryRange}`;
}

describe('formatSalary', () => {
  // Test case 1: Hourly rate format "$X/HR"
  test('formats hourly rate correctly', () => {
    expect(formatSalary('$10/HR')).toBe('$10');
    expect(formatSalary('$15/HR')).toBe('$15');
    expect(formatSalary('$25/HR')).toBe('$25');
  });

  // Test case 2: Salary range format "$X,000 - $Y,000"
  test('formats salary range correctly', () => {
    expect(formatSalary('$10,000 - $20,000')).toBe('$20K');
    expect(formatSalary('$75,000 - $95,000')).toBe('$95K');
    expect(formatSalary('$100,000 - $120,000')).toBe('$120K');
  });

  // Test case 3: Hourly rate with range "$X - $Y/hour"
  test('formats hourly rate range correctly', () => {
    expect(formatSalary('$16 - $18/hour')).toBe('* $16 - $18/hour');
    expect(formatSalary('$22 - $25/hour')).toBe('* $22 - $25/hour');
    expect(formatSalary('$18 - $21/hour')).toBe('* $18 - $21/hour');
  });

  // Test case 4: Hourly rate with tips "$X/hour + tips"
  test('formats hourly rate with tips correctly', () => {
    expect(formatSalary('$15/hour + tips')).toBe('* $15/hour + tips');
  });

  // Test case 5: Simple numeric range without dollar signs
  test('formats numeric range correctly', () => {
    expect(formatSalary('142000-214000')).toBe('* 142000-214000');
  });

  // Test case 6: Edge cases
  test('handles edge cases correctly', () => {
    // Empty string
    expect(formatSalary('')).toBe('* ');
    
    // Non-standard formats
    expect(formatSalary('Competitive')).toBe('* Competitive');
    expect(formatSalary('Negotiable')).toBe('* Negotiable');
    expect(formatSalary('$60,000 - $85,000')).toBe('$85K');
  });
});
