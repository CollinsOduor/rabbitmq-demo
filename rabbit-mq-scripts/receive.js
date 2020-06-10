

const amqp = require('amqplib/callback_api');
const winston = require('winston');

let flag = false;

module.exports = {
    check: function() {
        return flag;
    }
}

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs.log' })
    ]
});

amqp.connect('amqp://localhost', (connection_error, connection) => {
    if(connection_error) {
        console.log('Error connecting to server');
        check();
    } else {
        connection.createChannel((channel_creation_error, channel) => {
            if(channel_creation_error) {
                console.log('Error creating channel');
            } else {
                const queue = 'test';

                channel.assertQueue(queue, {durable: false});

                channel.consume(queue, (message) => {
                    const received_message = message.content.toString();
                    logger.info('Message saved to logs', received_message);
                    logger.log('info', {
                        level: 'info',
                        message: received_message
                    });

                    flag = true;
                    check();
                }, { noAck: true});
            }
        });
    }
});