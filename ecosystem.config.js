module.exports = {
  apps: [{
    name: 'pente',
    script: './server/index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-58-53-201.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/FEC.pem',
      ref: 'origin/master',
      repo: 'https://github.com/wiggitywhitney/hratx43-mvp-pente.git',
      path: '/home/ubuntu/',
      'post-deploy': 'npm install && npm run react-dev && pm2 startOrRestart ecosystem.config.js'
    }
  }
}