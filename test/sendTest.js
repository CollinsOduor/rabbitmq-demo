const { assert } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("Send", () => {
  let send;
  let amqpMock;
  let channelMock;

  beforeEach(() => {
    channelMock = {
      assertQueue: sinon.stub(),
      sendToQueue: sinon.stub(),
    };

    const connectionMock = {
      createChannel: sinon.stub().yields(null, channelMock),
    };

    amqpMock = {
      connect: sinon.stub().yields(null, connectionMock),
    };

    send = proxyquire("../rabbit-mq-scripts/send", {
      "amqplib/callback_api": amqpMock,
    });
  });

  it("should send message successfully", () => {
    const req = {
      body: {
        message: "Test message",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    send(req, res);

    assert(amqpMock.connect.calledOnce);
    assert(channelMock.assertQueue.calledOnceWith("test", { durable: false }));
    assert(
      channelMock.sendToQueue.calledOnceWith(
        "test",
        Buffer.from(req.body.message),
      ),
    );
    assert(
      res.json.calledOnceWith({
        response: "Message successfully added to queue",
      }),
    );
  });

  it("should handle message sending error", () => {
    const req = {
      body: {
        message: "Test message",
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    amqpMock.connect.yields(new Error("Connection error"));

    send(req, res);

    assert(amqpMock.connect.calledOnce);
    assert(res.status.calledOnceWith(500));
    assert(res.json.calledOnceWith({ response: "Internal server error" }));
  });
});
