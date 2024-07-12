#!/usr/bin/env bun

import fs from "fs";
import { parse } from "svgson";
import { program } from "commander";
import { runAllChecks } from "./checks";
import { generateReport } from "./report";
import type { Config, ConfigRules, ErrorObject } from "./types";
import { glob } from "glob";
import path from "path";
import { DefaultConfig } from "./constants";
import { version } from "../package.json";

async function analyzeSVG(filePath: string, rules: ConfigRules) {
  const svgString = fs.readFileSync(filePath, "utf8");
  const parsedSVG = await parse(svgString);
  const results = runAllChecks(parsedSVG, rules);
  return { filePath, results };
}

function getDirectoryWithConfig(directory?: string) {
  const configPath = path.join(directory ?? process.cwd(), ".svg-a11y-checkrc.json");
  if (fs.existsSync(configPath)) {
    return configPath;
  } else {
    process.chdir("..");
    return getDirectoryWithConfig();
  }
}

function loadConfig(directory: string): Config {
  const configPath = getDirectoryWithConfig(directory);
  if (configPath && fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  }
  return DefaultConfig;
}

async function analyzeDirectory(directory: string) {
  const config = loadConfig(directory);
  const ignorePatterns = config.ignorePatterns || [];
  const svgFiles = glob.sync(path.join(directory, "**/*.svg"), {
    ignore: ignorePatterns,
  });
  const results = await Promise.all(
    svgFiles.map((file) => analyzeSVG(file, config.rules))
  );
  return generateReport(results);
}

program
  .version(version)
  .option(
    "-d, --directory <directory>",
    "Directory to scan for SVG files",
    process.cwd()
  )
  .action(async (options) => {
    try {
      const report = await analyzeDirectory(options.directory);
      console.log(report);
    } catch (error: unknown) {
      console.error("Error analyzing SVG:", (error as ErrorObject).message);
    }
  });

program.parse(process.argv);
