import type { SvgElement } from "../types";

import ColorContrastChecker from "color-contrast-checker";

function checkTitle(svg: SvgElement) {
  const titleElement = svg.children.find((child) => child.name === "title");
  return {
    passed: !!titleElement,
    message: titleElement ? "Title element found" : "No title element found",
  };
}

function checkDescription(svg: SvgElement) {
  const descElement = svg.children.find((child) => child.name === "desc");
  return {
    passed: !!descElement,
    message: descElement
      ? "Description element found"
      : "No description element found",
  };
}

function checkAriaLabels(svg: SvgElement) {
  const elementsWithAriaLabel = findElementsWithAttribute(svg, "aria-label");
  return {
    passed: elementsWithAriaLabel.length > 0,
    message: `Found ${elementsWithAriaLabel.length} elements with aria-label`,
  };
}

function checkContrast(svg: SvgElement) {
  const ccc = new ColorContrastChecker();
  const textElements = findElementsByName(svg, "text");
  let passedChecks = 0;
  let totalChecks = 0;

  textElements.forEach((text) => {
    const fill = text.attributes.fill || "#000000";
    const parentFill = findParentFill(text) || "#ffffff";
    if (ccc.isLevelAA(fill, parentFill, 14)) {
      passedChecks++;
    }
    totalChecks++;
  });

  return {
    passed: passedChecks === totalChecks,
    message: `${passedChecks}/${totalChecks} text elements pass contrast check`,
  };
}

function findElementsWithAttribute(element: SvgElement, attributeName: string) {
  let elements: SvgElement[] = [];
  if (element.attributes && element.attributes[attributeName]) {
    elements.push(element);
  }
  if (element.children) {
    element.children.forEach((child) => {
      elements = elements.concat(
        findElementsWithAttribute(child, attributeName)
      );
    });
  }
  return elements;
}

function findElementsByName(element: SvgElement, name: string) {
  let elements: SvgElement[] = [];
  if (element.name === name) {
    elements.push(element);
  }
  if (element.children) {
    element.children.forEach((child) => {
      elements = elements.concat(findElementsByName(child, name));
    });
  }
  return elements;
}

function findParentFill(element: SvgElement) {
  if (!element.parent) return null;
  if (element.parent.attributes && element.parent.attributes.fill) {
    return element.parent.attributes.fill;
  }
  return findParentFill(element.parent);
}

export function runAllChecks(svg: SvgElement) {
  return {
    title: checkTitle(svg),
    description: checkDescription(svg),
    ariaLabels: checkAriaLabels(svg),
    contrast: checkContrast(svg),
  };
}
