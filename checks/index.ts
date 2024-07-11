import type { ConfigRules, ResultsType, SvgElement } from "../types";

import ColorContrastChecker from "color-contrast-checker";

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

function findElementsByAttributes(element: SvgElement, attributes: string[]) {
  let elements: SvgElement[] = [];
  if (
    element.attributes &&
    attributes.some((attr) => element.attributes[attr] !== undefined)
  ) {
    elements.push(element);
  }
  if (element.children) {
    element.children.forEach((child) => {
      elements = elements.concat(findElementsByAttributes(child, attributes));
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

function findElementsByNames(element: SvgElement, names: string[]) {
  let elements: SvgElement[] = [];
  if (names.includes(element.name)) {
    elements.push(element);
  }
  if (element.children) {
    element.children.forEach(child => {
      elements = elements.concat(findElementsByNames(child, names));
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

function checkRoleAttributes(svg: SvgElement) {
  const svgElement = svg.children.find((child) => child.name === "svg") ?? svg;
  const hasRole = svgElement && svgElement.attributes.role === "img";
  return {
    passed: !!hasRole,
    message: hasRole
      ? 'SVG has proper role="img" attribute'
      : 'SVG is missing role="img" attribute',
  };
}

function checkTextAlternatives(svg: SvgElement) {
  const svgElement = svg.children.find((child) => child.name === "svg") ?? svg;
  const hasAriaLabel = svgElement && svgElement.attributes["aria-label"];
  const hasAriaLabelledBy =
    svgElement && svgElement.attributes["aria-labelledby"];
  return {
    passed: !!(hasAriaLabel || hasAriaLabelledBy),
    message:
      hasAriaLabel || hasAriaLabelledBy
        ? "SVG has text alternative (aria-label or aria-labelledby)"
        : "SVG is missing text alternative (aria-label or aria-labelledby)",
  };
}

function checkFocusableElements(svg: SvgElement) {
  const interactiveElements = findElementsByAttributes(svg, [
    "onclick",
    "onkeypress",
    "onkeydown",
    "onkeyup",
  ]);
  const focusableElements = interactiveElements.filter(
    (el) =>
      el.attributes.tabindex !== undefined || ["a", "button"].includes(el.name)
  );
  return {
    passed: interactiveElements.length === focusableElements.length,
    message: `${focusableElements.length}/${interactiveElements.length} interactive elements are focusable`,
  };
}

function checkAnimatedContent(svg: SvgElement) {
  const animatedElements = findElementsByNames(svg, ['animate', 'animateMotion', 'animateTransform']);
  const controllableAnimations = animatedElements.filter(el => 
    el.attributes['begin'] === 'indefinite' || el.attributes['end'] === 'indefinite'
  );
  return {
    passed: animatedElements.length === controllableAnimations.length,
    message: `${controllableAnimations.length}/${animatedElements.length} animations are controllable`,
  };
}

function checkImageText(svg: SvgElement) {
  const textPaths = findElementsByName(svg, 'textPath');
  const hasTextPaths = textPaths.length > 0;
  return {
    passed: !hasTextPaths,
    message: hasTextPaths ? 
      `Found ${textPaths.length} text paths. Consider providing this text content in an accessible manner.` : 
      'No text paths found.',
  };
}

function checkLanguageDeclaration(svg: SvgElement) {
  const svgElement = svg.children.find(child => child.attributes['xml:lang']);
  return {
    passed: !!svgElement,
    message: svgElement ? 'SVG has language declaration' : 'SVG is missing language declaration',
  };
}

function checkResponsiveScaling(svg: SvgElement) {
  const svgElement = svg.children.find(child => child.name === 'svg') ?? svg;
  const hasViewBox = svgElement && svgElement.attributes.viewBox;
  return {
    passed: !!hasViewBox,
    message: hasViewBox ? 'SVG uses viewBox for proper scaling' : 'SVG is missing viewBox attribute for responsive scaling',
  };
}

function checkUniqueIDs(svg: SvgElement) {
  const ids = new Set();
  const duplicateIds = new Set();
  
  function traverseElement(element: SvgElement) {
    if (element.attributes && element.attributes.id) {
      if (ids.has(element.attributes.id)) {
        duplicateIds.add(element.attributes.id);
      } else {
        ids.add(element.attributes.id);
      }
    }
    if (element.children) {
      element.children.forEach(traverseElement);
    }
  }
  
  traverseElement(svg);
  
  return {
    passed: duplicateIds.size === 0,
    message: duplicateIds.size === 0 ? 
      'All IDs are unique' : 
      `Found ${duplicateIds.size} duplicate IDs: ${Array.from(duplicateIds).join(', ')}`,
  };
}

export function runAllChecks(svg: SvgElement, rules: ConfigRules) {
  const results: ResultsType = {};

  if (rules.requireTitle !== false) {
    results.title = checkTitle(svg);
  }

  if (rules.requireDescription !== false) {
    results.description = checkDescription(svg);
  }

  if (rules.checkAriaLabel !== false) {
    results.ariaLabels = checkAriaLabels(svg);
  }

  if (rules.checkContrast !== false) {
    results.contrast = checkContrast(svg);
  }

  if (rules.checkRoleAttributes !== false) {
    results.roleAttributes = checkRoleAttributes(svg);
  }

  if (rules.checkTextAlternatives !== false) {
    results.textAlternatives = checkTextAlternatives(svg);
  }

  if (rules.checkFocusableElements !== false) {
    results.focusableElements = checkFocusableElements(svg);
  }
  
  if (rules.checkAnimatedContent !== false) {
    results.animatedContent = checkAnimatedContent(svg);
  }

  if (rules.checkImageText !== false) {
    results.imageText = checkImageText(svg);
  }

  if (rules.checkLanguageDeclaration !== false) {
    results.languageDeclaration = checkLanguageDeclaration(svg);
  }

  if (rules.checkResponsiveScaling !== false) {
    results.responsiveScaling = checkResponsiveScaling(svg);
  }

  if (rules.checkUniqueIDs !== false) {
    results.uniqueIDs = checkUniqueIDs(svg);
  }

  return results;
}
