import type { Results } from "../types";

export function generateReport(results: Results[]) {
  let report = "SVG Accessibility Report\n\n";
  let totalChecks = 0;
  let totalPassed = 0;

  results.forEach(({ filePath, results: fileResults }) => {
    report += `File: ${filePath}\n`;
    let individualResult = '';
    let individualPassed = 0;
    let individualChecked = 0;
    for (const [checkName, result] of Object.entries(fileResults)) {
      report += `${checkName}: ${result.passed ? "PASSED" : "FAILED"}\n`;
      report += `${result.message}\n`;
      totalChecks++;
      individualChecked++;
      if (result.passed) {
        totalPassed++;
        individualPassed++;
      }
    }
    const individualScore = (individualPassed / individualChecked) * 100;
    individualResult += `File Score: ${individualScore.toFixed(2)}% (${individualPassed}/${individualChecked} checks passed)\n`
    report +=  individualResult;
    report += `\n`;
  });

  const overallScore = (totalPassed / totalChecks) * 100;
  report += `Overall Score: ${overallScore.toFixed(
    2
  )}% (${totalPassed}/${totalChecks} checks passed)\n`;

  return report;
}
