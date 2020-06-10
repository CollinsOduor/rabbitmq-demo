

const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser').json();

const express = require('express');
const router = express.Router();

router.post('/posttomq', bodyParser, (req, res) => {

    if(!req.body || typeof req.body === 'undefined') {
        return res.status(400).json({'response': 'No body was appended'});
    }

    if(!req.body.message || typeof req.body.message === 'undefined') {
        return res.status(400).json({'response': 'Message not seen'});
    }

    amqp.connect('amqp://localhost', (connection_error, connection) => {
        console.log(amqp.credentials);
        if(connection_error) {
            console.log('Error connecting to server');
            return res.status(500).json({'response': 'Internal server error'});
        } else {
            connection.createChannel((channel_creation_error, channel) => {
                if(channel_creation_error) {
                    console.log('Error creating channel');
                    return res.status(500).json({'response': 'Internal server error'});
                } else {
                    const queue = 'test';
                    // const message = 'This is a test';
                    const message = req.body.message;

                    channel.assertQueue(queue, {durable: false});

                    channel.sendToQueue(queue, Buffer.from(message));

                    console.log('Message sent was --->', message);
                    return res.status(200).json({'response': 'Message successfully added to queue'});
                }
            });

            setTimeout(() => {
                connection.close();
                process.exit(0);
            }, 500);
        }
    });
})

module.exports = router;