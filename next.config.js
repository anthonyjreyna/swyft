/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      { source: "/", destination: "/landing.html" },
      { source: "/careers", destination: "/careers.html" },
      { source: "/talent", destination: "/talent.html" },
      { source: "/talent-video", destination: "/talent-video.html" },
      { source: "/talent-interview", destination: "/talent-interview.html" },
      { source: "/privacy", destination: "/privacy.html" },
    ];
  },
};
