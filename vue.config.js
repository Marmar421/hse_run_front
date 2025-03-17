const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  server: {
    host: 'localhost.local',
    port: 8088
  }
});
