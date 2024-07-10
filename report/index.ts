import type { Results } from "../types";

export function generateReport(results: Results[]) {
  let report = "SVG Accessibility Report\n\n";
  let totalChecks = 0;
  let totalPassed = 0;

  results.forEach(({ filePath, results: fileResults }) => {
    report += `File: ${filePath}\n`;

    for (const [checkName, result] of Object.entries(fileResults)) {
      report += `${checkName}: ${result.passed ? "PASSED" : "FAILED"}\n`;
      report += `${result.message}\n`;
      totalChecks++;
      if (result.passed) totalPassed++;
    }

    report += `\n`;
  });

  const overallScore = (totalPassed / totalChecks) * 100;
  report += `Overall Score: ${overallScore.toFixed(
    2
  )}% (${totalPassed}/${totalChecks} checks passed)\n`;

  return report;
}
