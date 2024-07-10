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

export interface Results {
  title: {
    passed: boolean;
    message: string;
  };
  description: {
    passed: boolean;
    message: string;
  };
  ariaLabels: {
    passed: boolean;
    message: string;
  };
  contrast: {
    passed: boolean;
    message: string;
  };
}
