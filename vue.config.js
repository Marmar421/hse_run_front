const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    // host: 'localhost.local',
    // port: 80,
    proxy: {
      '^/api': {
        target: 'http://localhost:8000',
        changeOrigin: false,
        ws: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
});
