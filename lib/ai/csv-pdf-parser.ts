import Papa from "papaparse";

export function parseCSVForAI(csvString: string): string {
  // Parse CSV and remove empty rows or useless columns
  const parsed = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new Error("Failed to parse CSV: " + parsed.errors[0].message);
  }

  // Convert to a compact string representation showing only rows with data
  const compactLines = parsed.data.map((row: any, i: number) => {
    // Keep only truthy values to save tokens
    const pairs = Object.entries(row)
      .filter(([, v]) => v !== "" && v !== null && v !== undefined)
      .map(([k, v]) => `${k}: ${v}`);
    return `Row ${i + 1}: ${pairs.join(", ")}`;
  });

  return compactLines.join("\n");
}
