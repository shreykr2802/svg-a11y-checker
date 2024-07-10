import type { INode } from "svgson";

export interface Attributes {
  [key: string]: string;
}

export interface SvgElement extends INode {
  name: string;
  type: string;
  value: string;
  parent?: SvgElement | null;
  attributes: Attributes;
  children: SvgElement[];
}

export interface ErrorObject {
  message: string;
}

type ResultKey = "title" | "description" | "ariaLabels" | "contrast";

export type ResultsType = {
  [key in ResultKey]?: {
    passed: boolean;
    message: string;
  };
};

export interface Results {
  filePath: string;
  results: ResultsType;
}

export type ConfigRules = {
  requireTitle: boolean;
  requireDescription: boolean;
  checkContrast: boolean;
  checkAriaLabel: boolean;
};

export interface Config {
  ignorePatterns: string[];
  rules: ConfigRules
}
