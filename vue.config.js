const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false,
    },
    https: false,
    proxy: {
      "/api" : {
        target: "http://localhost:5002",
        ws: true,
        changeOrigin: true
      },
    },
  }
})
