//tests/unit/app.test.js
const request = require('supertest');

const app = require('../../src/app');

describe('/resource not found', () => {
  test('should return HTTP 404 response', () => request(app).get('/no-such-route').expect(404));
});
