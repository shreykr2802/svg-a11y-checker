const DefaultConfig = {
  ignorePatterns: ["node_modules/**", "build/**"],
  rules: {
    requireTitle: true,
    requireDescription: true,
    checkContrast: true,
    checkAriaLabels: true,
    checkRoleAttributes: true,
    checkTextAlternatives: true,
    checkFocusableElements: true,
    checkAnimatedContent: true,
    checkImageText: true,
    checkLanguageDeclaration: true,
    checkResponsiveScaling: true,
    checkUniqueIDs: true
  },
};

export { DefaultConfig };
