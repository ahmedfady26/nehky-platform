/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "nehky-primary": "#059669",
        "nehky-primary-light": "#10B981",
        "nehky-primary-dark": "#047857",
        "nehky-secondary": "#1E40AF",
        "nehky-secondary-light": "#3B82F6",
        "nehky-secondary-dark": "#1E3A8A",
        "nehky-accent": "#0EA5E9",
        "nehky-accent-light": "#38BDF8",
        "nehky-accent-dark": "#0284C7",
      },
      fontFamily: {
        'sans': ['var(--font-cairo)', 'Cairo', 'system-ui', 'sans-serif'],
        'cairo': ['var(--font-cairo)', 'Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
