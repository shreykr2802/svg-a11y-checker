## **svg-a11y-checker**

Repository to create a checker for svg files and provide report, because enlist doesn't cover all the checks for SVG file.

Projects which are SVG heavy and focused to all the audiences, need all the accessibility checks.

[![npm version](https://badge.fury.io/js/svg-a11y-checker.svg)](https://badge.fury.io/js/svg-a11y-checker)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

---

### **usage**

*   run directly `npx svg-a11y-check` to scan through all the svg present in the project folder.
    *   downside it will do all the 12 checks.
*   install the package to project  
    `npm install svg-a11y-checker`, `yarn install svg-a11y-checker`, `pnpm install svg-a11y-checker`, `bun add svg-a11y-checker`.
    *   add a script eg. `"check-svg": "svg-a11y-checker"`. `npm run svg-a11y-checker`.
    *   add it along lint script eg. `"lint": "svg-a11y-checker && next lint"`. 
*   If you need to run it for a specific folder, `npx svg-a11y-check -d ./public/images/svgImages`. This will scan all the svg inside svgImages folder.

---

### sample output

```plaintext
File: /Users/shreykumar/Documents/nextjs-app/public/moresvg/next.svg
title: FAILED
No title element found
description: FAILED
No description element found
ariaLabels: FAILED
Found 0 elements with aria-label
contrast: PASSED
0/0 text elements pass contrast check
roleAttributes: FAILED
SVG is missing role="img" attribute
textAlternatives: FAILED
SVG is missing text alternative (aria-label or aria-labelledby)
focusableElements: PASSED
0/0 interactive elements are focusable
imageText: PASSED
No text paths found.
languageDeclaration: FAILED
SVG is missing language declaration
responsiveScaling: PASSED
SVG uses viewBox for proper scaling
uniqueIDs: PASSED
All IDs are unique
File Score: 45.45% (5/11 checks passed)
```

---

### future plans

*   more readable output message.
*   better formatted output message.
*   colored outputs for Failed and Success messages.