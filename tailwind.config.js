/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#146EF5",
        "secondary": "#10B981",
        "neutral": {
          "50": "#F3F4F6",
          "900": "#111827"
        },
        "error": "#DC2626",
        "warning": "#F59E0B",
        "success": "#16A34A"
      },
      fontFamily: {
        "inter": [
          "Inter",
          "sans-serif"
        ],
        "sans": [
          "Inter",
          "sans-serif"
        ]
      }
    }
  },
  plugins: [],
}


