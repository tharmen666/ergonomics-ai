/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ohs-navy': '#001b2e', // Dark Navy
                'ohs-orange': '#F9A825',
                'ohs-blue': '#003D5C',
                'ohs-green': '#4CAF50',
                'ohs-dark': '#00121e',
            }
        },
    },
    plugins: [],
}
