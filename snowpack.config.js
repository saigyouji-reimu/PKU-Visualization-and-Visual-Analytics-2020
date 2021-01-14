/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/' },
    src: { url: '/_dist_' },
  },
  plugins: ['@snowpack/plugin-optimize'],
};
