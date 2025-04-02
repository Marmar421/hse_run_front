const { defineConfig } = require("@vue/cli-service");

const proxyConfig = {
  target: 'http://127.0.0.1:8000',
  changeOrigin: false,
  ws: false
};

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    host: 'localhost.local',
    port: 80,
    proxy: {
      '^/api': { ...proxyConfig, pathRewrite: { '^/api': '/api' } },
      '^/static': { ...proxyConfig, pathRewrite: { '^/static': '/static' } },
      '^/admin': { ...proxyConfig, pathRewrite: { '^/admin': '/admin' } }
    }
  }
});
