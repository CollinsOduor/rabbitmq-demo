const express = require('express');
const app = express();

const sendRoute = require('./rabbit-mq-scripts/send');

app.use('/test', sendRoute);

app.listen(3000, '0.0.0.0', () => {console.log('Rabbit test is up')});