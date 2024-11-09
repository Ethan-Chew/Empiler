/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "ocbcred": "#da291c",
        "ocbcdarkred": "#b31f14",
        "custom-blue-gray": '#677A84',
        "chatred": "#FB606A"
      },
      backgroundImage: {
        "faq-hero": "url(https://www.ocbc.com/iwov-resources/sg/ocbc/personal/img/live/help-and-support/featured_bg-contactus.png)"
      }
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
  },
  plugins: [],
}