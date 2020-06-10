

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (connection_error, connection) => {
    if(connection_error) {
        console.log('Error connecting to server');
    } else {
        connection.createChannel((channel_creation_error, channel) => {
            if(channel_creation_error) {
                console.log('Error creating channel');
            } else {
                const queue = 'test';

                channel.assertQueue(queue, {durable: false});

                channel.consume(queue, (message) => {
                    const received_message = message.content.toString();
                    console.log('received message is ---------->', received_message);
                }, { noAck: true});
            }
        });
    }
});