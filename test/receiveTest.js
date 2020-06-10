const assert = require('chai').assert;
const app = require('../rabbit-mq-scripts/receive');

describe('Receive', () => {
    it('should return true', () => {
        assert.equal(app.check(), true);
    })
});