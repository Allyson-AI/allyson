module.exports = {
  ...config,
  rules: {
    // Add or override rules here
    // Example: Turn off a specific rule
    "no-unused-vars": "off",
    // Example: Set a rule to warning instead of error
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "off", // Disables unused variable warnings
    "@typescript-eslint/no-explicit-any": "off", // Allows 'any' type
    // Add more rules as needed
  },
}; 