module.exports = {
  apps : [{
    name  : "SUMMATE SERVER",
    script : "./dist/server.js",
    env_production : {
      NODE_ENV: "production"
    }
  }]
}
