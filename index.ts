import fs from "fs";
import { parse } from "svgson";
import { program } from "commander";
import { runAllChecks } from "./checks";
import { generateReport } from "./report";
import type { ErrorObject } from "./types";

async function analyzeSVG(filePath: string) {
  const svgString = fs.readFileSync(filePath, "utf8");
  const parsedSVG = await parse(svgString);
  const results = runAllChecks(parsedSVG);
  return generateReport(results, filePath);
}

program
  .version("1.0.0")
  .argument("<file>", "SVG file to analyze")
  .action(async (file) => {
    try {
      const report = await analyzeSVG(file);
      console.log(report);
    } catch (error: unknown) {
      console.error("Error analyzing SVG:", (error as ErrorObject).message);
    }
  });

program.parse(process.argv);
