/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      { source: "/", destination: "/landing.html" },
      { source: "/careers", destination: "/careers.html" },
      { source: "/privacy", destination: "/privacy.html" },
    ];
  },
};
