// ============================================================
//  PM2 Ecosystem Config — Zero-downtime production
//  Usage: pm2 start ecosystem.config.js
// ============================================================
module.exports = {
  apps: [
    {
      name: "saas-project-manager",
      script: "node_modules/.bin/next",
      args: "start",
      instances: "max",          // use all CPU cores
      exec_mode: "cluster",      // cluster mode for zero-downtime
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
