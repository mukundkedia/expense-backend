var path = require('path');
var express = require('express');
var dotenv = require('dotenv');
var colors = require('colors');
var morgan = require('morgan');
var cors=require('cors')

var connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

var transactions = require('./routes/transactions');

var app = express();
app.use(cors({ origin: ['https://example.com', 'https://stackoverflow.com', 'https://mukundkedia.github.io', 'http://localhost:3000'], credentials: true }))
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  
}
app.use(express.json());
//app.use(cors({ origin: ['https://example.com', 'https://stackoverflow.com', 'https://mukundkedia.github.io', 'http://localhost:3000'] }))

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/transactions', transactions);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install npm && run build"
/**
 * 
 * "server": "nodemon server",
    "build": "cd client && npm run build",
    "install-client": "cd client && npm install",
    "heroku-postbuild": "npm run install-client && npm run build",
 */
/*"client": "cd client && npm start",
    "dev": "concurrently \"npm run server\" \"npm run client\""*/