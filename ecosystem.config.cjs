module.exports = {
  apps: [
    {
      name: 'dhivehi-tutor',
      script: 'server.js',
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
