## **svg-a11y-checker**

Repository to create a checker for svg files and provide report.

[![npm version](https://badge.fury.io/js/svg-a11y-checker.svg)](https://badge.fury.io/js/svg-a11y-checker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

### **usage**

*   Scan all the `.svg` files inside the project folder to test.  
    `bun dev`
*   Scan specific directory for all the `.svg` files inside it.  
    `bun start -d ./__test_all_passed`

---

## **SVG Accessibility Checker**

This tool performs the following 12 accessibility checks on SVG files:

1.  Title Check - `requireTitle`
    1.  Ensures the SVG has a `<title>` element.
    2.  A title provides a brief, descriptive text for the entire SVG.
2.  Description Check - `requireDescription`
    1.  Verifies the presence of a `<desc>` element.
    2.  A description offers more detailed information about the SVG's content.
3.  ARIA Labels Check - `checkAriaLabel`
    1.  Checks for the use of `aria-label` attributes.
    2.  ARIA labels provide accessible names for elements within the SVG.
4.  Contrast Check - `checkContrast`
    1.  Analyzes the color contrast of text elements against their backgrounds.
    2.  Ensures text is readable for users with visual impairments.
5.  Role Attributes Check - `checkRoleAttributes`
    1.  Verifies the proper use of the `role="img"` attribute on the SVG element.
    2.  Correct role assignment helps assistive technologies interpret the SVG correctly.
6.  Text Alternatives Check - `checkTextAlternatives`
    1.  Checks for the presence of text alternatives via `aria-label` or `aria-labelledby`.
    2.  Text alternatives provide descriptions for complex SVGs that can't be fully conveyed by the title alone.
7.  Focusable Elements Check - `checkFocusableElements`
    1.  Ensures interactive elements within the SVG are properly focusable.
    2.  Focusable elements are crucial for keyboard navigation.
8.  Animated Content Check - `checkAnimatedContent`
    1.  Identifies animated elements and checks if they can be controlled (paused, stopped).
    2.  Controllable animations are important for users who may be distracted by or unable to perceive rapid changes.
9.  Image Text Check - `checkImageText`
    1.  Detects text rendered as paths or shapes.
    2.  Suggests providing text content in an accessible manner for screen readers.
10.  Language Declaration Check - `checkLanguageDeclaration`  
    1\. Verifies the presence of a \`lang\` attribute on the SVG element.  
    2\. Language declaration helps screen readers use the correct pronunciation.
11.  Responsive Scaling Check - `checkResponsiveScaling`  
    1\. Checks if the SVG uses a \`viewBox\` for proper scaling across devices.  
    2\. Responsive scaling ensures the SVG is usable on various screen sizes.
12.  Unique IDs Check - `checkUniqueIDs`  
    1\. Ensures all IDs within the SVG are unique.  
    2\. Unique IDs are important for proper functioning of internal references and ARIA attributes.

Each check returns a pass/fail result and a descriptive message. The tool can be configured to run all or a subset of these checks.

---

## Default Checks

By default all the mentioned checks above will be executed.

To override the default checks, `.svg-a11y-checkrc.json` named file with below format has to be created with the desired checks enabled.

```javascript
{
  "ignorePatterns": ["node_modules/**", "build/**"],
  "rules": {
    "requireTitle": true,
    "requireDescription": true,
    "checkContrast": true,
    "checkAriaLabels": true,
    "checkRoleAttributes": true,
    "checkTextAlternatives": true,
    "checkFocusableElements": true,
    "checkAnimatedContent": true,
    "checkImageText": true,
    "checkLanguageDeclaration": false,
    "checkResponsiveScaling": true,
    "checkUniqueIDs": false
  }
}
```