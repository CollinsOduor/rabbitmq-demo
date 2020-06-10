 
This project is a demonstration of how applications communicate using message queues. It is built entirely with node.

Messages are appended to the queue (produced) in the file rabbit-mq-scripts/send.js. This is done through a post to the API.

A consumer (rabbit-mq-scripts/receive.js) is waiting in the background to receive messages from the queue.