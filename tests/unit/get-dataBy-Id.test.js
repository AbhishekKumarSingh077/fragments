const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('request denied due to lack of validation', () =>
    request(app).get('/v1/fragments').expect(401));

  test('request refused due to invalid login credentials', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_passowrd').expect(401));

  /*test('request succeeded, user get the fragment data with the given id', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const id = JSON.parse(postRes.text).fragment.id;

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe(data.toString());
  });

  test('request cannot be completed because no fragment with the specified id was found', async () => {
    const getRes = await request(app)
      .get('/v1/fragments/someId')
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(404);
  }); */
});
