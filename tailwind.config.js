/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['gorthia-regular', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            colors: {
                surface: '#141414',
                card: '#1a1a1a',
            },
        },
    },
    plugins: [],
};
