module.exports = {
  apps: [{
    name: 'pente',
    script: './server/index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-3-19-76-32.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/FEC.pem',
      ref: 'origin/master',
      repo: 'https://github.com/wiggitywhitney/hratx43-mvp-pente.git',
      path: '/home/ubuntu/',
      'post-deploy': 'npm install --ignore-scripts && npm run webpack && pm2 startOrRestart ecosystem.config.js'
    }
  }
}