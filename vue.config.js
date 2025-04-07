const { defineConfig } = require("@vue/cli-service");

const backendProxyConfig = {
  target: 'http://localhost:8005',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''  // Опционально, зависит от вашего API
  }
};

const proxyConfig = {
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
  ws: false,
  secure: true
};

const analyticsProxyConfig = {
  target: 'http://127.0.0.1:3000',
  changeOrigin: true,
  ws: false,
  secure: true
};

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: false,
  devServer: {
    host: 'localhost.local',
    port: 80,
    proxy: {
      '^/admin/stats': { ...analyticsProxyConfig, pathRewrite: { '^/admin/stats': '/api/analytics/teams' } },
      '^/api/analytics': { ...analyticsProxyConfig, pathRewrite: { '^/api/analytics': '/api/analytics' } },
      '^/api': backendProxyConfig,
      '^/static': { ...backendProxyConfig, pathRewrite: { '^/static': '/static' } },
      '^/admin(?!/stats)': { ...backendProxyConfig, pathRewrite: { '^/admin': '/admin' } },
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true,
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        },
        webp: {
          quality: 75
        }
      });
    
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    });
  },
  pwa: {
    name: 'HSE RUN',
    themeColor: '#4a90e2',
    msTileColor: '#4a90e2',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      exclude: [/\.map$/, /_redirects/]
    }
  }
});
