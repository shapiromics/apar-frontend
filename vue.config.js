module.exports = {
    devServer: {
      proxy: {
        '^/auth/': {
          target: 'http://127.0.0.1:8000/',
          ws: false,
        }
      }
    },
  };