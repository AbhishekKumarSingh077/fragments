// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
describe('GET /v1/fragments/:id/info', () => {
  test('unauthenticated requests denied', () =>
    request(app).get('/v1/fragments/18956/info').expect(401));

  test('No valid credentials received', () =>
    request(app)
      .get('/v1/fragments/someid/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));
});
