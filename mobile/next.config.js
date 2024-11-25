// mobile/next.config.js
const withPWA = require('next-pwa')({
    dest: 'public'
});

module.exports = withPWA({
    reactStrictMode: true,
    pwa: {
        disable: process.env.NODE_ENV === 'development',
        register: true,
        skipWaiting: true,
        dest: 'public'
    }
});