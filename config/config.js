// env uguale a process.env.NODE_ENV o, se questo è undefined => development
const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {

  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
