/**
 * Helper to export an array of JSON objects to a downloadable CSV file.
 * @param {string} filename Name of the downloaded file (e.g. "employees_report.csv")
 * @param {Array<Object>} data Array of data objects
 */
export const exportToCSV = (filename, data) => {
  if (!data || !data.length) return;

  // Extract headers
  const headers = Object.keys(data[0]);

  // Construct CSV lines
  const csvRows = [];
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header] === null || row[header] === undefined ? "" : row[header];
      const escaped = ("" + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
