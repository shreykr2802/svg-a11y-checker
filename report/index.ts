import type { Results } from "../types";

export function generateReport(results: Results, filePath: string) {
  let report = `Accessibility Report for ${filePath}\n\n`;

  for (const [checkName, result] of Object.entries(results)) {
    report += `${checkName}: ${result.passed ? "PASSED" : "FAILED"}\n`;
    report += `  ${result.message}\n\n`;
  }

  const passedChecks = Object.values(results).filter((r) => r.passed).length;
  const totalChecks = Object.keys(results).length;
  const score = (passedChecks / totalChecks) * 100;

  report += `Overall Score: ${score.toFixed(
    2
  )}% (${passedChecks}/${totalChecks} checks passed)`;

  return report;
}
