const express = require('express');
const cors = require('cors');

const { dbConnection } = require("./config/database")
const allRoutes = require("./routes/index")

const app = express();

// Allow credentials and specify frontend origin
app.use(cors({
  origin: 'http://localhost:3001', // Change this if your frontend runs on a different port
  credentials: true
}));

app.use(express.static('public'));
app.use(express.json());
require('dotenv').config();

const { APP_HOST, APP_PORT = 3000 } = process.env;

app.use(allRoutes);


app.listen(APP_PORT, () => {
  dbConnection()
  const serverUrl = `http://${APP_HOST}:${APP_PORT}`
  const apiUrl = `${serverUrl}`
  console.log(`\n\nServer URL ${serverUrl}`);
  console.log(`API URL ${apiUrl} \n\n`);
});