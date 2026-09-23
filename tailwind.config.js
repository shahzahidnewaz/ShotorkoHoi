
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A18",
        "ink-soft": "#514E47",
        paper: "#F7F4EE",
        "paper-raised": "#FFFFFF",
        teal: { DEFAULT: "#2A5A9E", soft: "#E5EBF3", dark: "#22487E" },
        brick: { DEFAULT: "#C4622D", soft: "#F6E7DD" },
        green: { DEFAULT: "#2F6E4F", soft: "#E7F0EA" },
        hairline: { DEFAULT: "#DCD5C4", strong: "#C7BEA9" }
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "-apple-system", "sans-serif"]
      },
      maxWidth: {
        content: "880px",
        wide: "1080px"
      },
      borderRadius: {
        DEFAULT: "3px"
      }
    }
  },
  plugins: []
};
