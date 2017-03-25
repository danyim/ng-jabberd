module.exports = () => ({
  plugins: [
    require('postcss-import')(),
    require('postcss-comment/hookRequire')(),
    require('postcss-calc')(),
    require('postcss-nesting')(),
    require('postcss-color-function')(),
    require('postcss-flexbugs-fixes')(),
    require('autoprefixer')(),
  ],
});
