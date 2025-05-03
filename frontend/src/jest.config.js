import { defineConfig } from "vite";

export default defineConfig({
  test: {
    environment: "jsdom", // Use jsdom for testing React components
    setupFilesAfterEnv: [
      "@testing-library/jest-dom/extend-expect", // For additional matchers
    ],
  },
});
