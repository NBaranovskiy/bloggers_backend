import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { BlogInputDto } from '../../../src/blogs/dto/blog.input-dto';
import { BLOG_PATH } from '../../../src/core/paths/paths';

const app = express();
setupApp(app);

describe('Bloggers API', () => {
  const testBlogData: BlogInputDto = {
    name: 'Valentin',
    description: "string",
    websiteUrl: "https://0PD0eJt6ukBY0rdte6yv6lkoLndpjNTxoM1tFpqiXERQfeqqaFpptG8rO5V22PDV8rl.4HajktNz6fb3ioGHvq8sxDZ9"
    };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(204);
  });

  it('✅ should create blogger; POST /api/blogs', async () => {
    const newBlogger: BlogInputDto = {
      ...testBlogData,
    };

    await request(app)
      .post(BLOG_PATH)
      .send(newBlogger)
      .expect(201);
  });

  it('✅ should return bloggers list; GET /api/blogs', async () => {
    await request(app)
      .post(BLOG_PATH)
      .send({ ...testBlogData, name: 'Another Driver' })
      .expect(201);

    await request(app)
      .post(BLOG_PATH)
      .send({ ...testBlogData, name: 'Another Driver2' })
      .expect(201);

    const bloggersListResponse = await request(app)
      .get(BLOG_PATH)
      .expect(200);

    expect(bloggersListResponse.body).toBeInstanceOf(Array);
    expect(bloggersListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('✅ should return blogger by id; GET /api/blogs/:id', async () => {
    const createResponse = await request(app)
      .post(BLOG_PATH)
      .send({ ...testBlogData, name: 'Another Driver' })
      .expect(201);

    const getResponse = await request(app)
      .get(`${BLOG_PATH}/${createResponse.body.id}`)
      .expect(200);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(String),
      name: expect.any(String),
    });
  });

  it('✅ should update blogger; PUT /api/blogs/:id', async () => {
    const createResponse = await request(app)
      .post(BLOG_PATH)
      .send({ ...testBlogData, name: 'Another Driver' })
      .expect(201);

    const blogUpdateData: BlogInputDto = {
      ...testBlogData,
      name: 'Seriu',
      description: "string",
      websiteUrl: "https://1PD0eJt6ukBY0rdte6yv6lkoLndpjNTxoM1tFpqiXERQfeqqaFpptG8rO5V22PDV8rl.4HajktNz6fb3ioGHvq8sxDZ9"
    };

    await request(app)
      .put(`${BLOG_PATH}/${createResponse.body.id}`)
      .send(blogUpdateData)
      .expect(204);

    const blogResponse = await request(app).get(
      `${BLOG_PATH}/${createResponse.body.id}`,
    );

    expect(blogResponse.body).toEqual({
      ...blogUpdateData,
      id: createResponse.body.id,
    });
  });

  it(`✅ DELETE /api/blogs/:id and check after NOT FOUND`, async () => {
  // 1. Создаем блогера
  const createResponse = await request(app)
    .post(BLOG_PATH)
    .send({ ...testBlogData, name: 'Another Driver' })
    .expect(201);

  // 2. Удаляем блогера (ожидаем 204)
  await request(app)
    .delete(`${BLOG_PATH}/${createResponse.body.id}`)
    .expect(204);

  // 3. Проверяем, что блогер действительно удален (ожидаем 404)
  await request(app)
    .get(`${BLOG_PATH}/${createResponse.body.id}`)
    .expect(404);
});
});