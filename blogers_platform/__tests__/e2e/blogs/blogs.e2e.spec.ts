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


  it('✅Blogs with pagination  POST -> "/blogs/:blogId/posts": should create new post for specific blog', async () => {
    const testBlogData = {"content":"new post content","shortDescription":"description","title":"post title"}
    const createResponse = await request(app)
        .post(`/api/blogs`)
        .send(testBlogData)
        .expect(200);
    await request(app)
      .get(`api/blogs`)
      .expect(201);
  })
});