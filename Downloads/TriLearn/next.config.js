const fs = require('fs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: 'file:./dev.db',
    NEXTAUTH_SECRET: 'your-nextauth-secret-key',
  },
}

module.exports = nextConfig 