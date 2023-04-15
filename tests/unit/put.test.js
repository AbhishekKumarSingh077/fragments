const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('request refued due to lack of validation', () =>
    request(app)
      .get('/v1/fragments')
      .send({
        body: 'Test this fragment',
      })
      .expect(401));

  test('PUT with id should update the fragment', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .send({
        body: 'Test this fragment',
      });
    const id = await response.body.fragment.id;

    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .send({
        body: 'Updated fragment',
      });
    expect(res.statusCode).toBe(200);
  });
});
