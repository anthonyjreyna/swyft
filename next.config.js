/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      { source: "/", destination: "/landing.html" },
      { source: "/careers", destination: "/careers.html" },

      // Hiring funnel — step-numbered URLs
      { source: "/talent-step-1", destination: "/talent.html" },
      { source: "/talent-step-2", destination: "/talent-video.html" },
      { source: "/talent-step-3", destination: "/talent-interview.html" },

      // Old URLs kept working so any links already shared don't break
      { source: "/talent", destination: "/talent.html" },
      { source: "/talent-video", destination: "/talent-video.html" },
      { source: "/talent-interview", destination: "/talent-interview.html" },
    ];
  },
};
