import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { PostInputDto } from '../../../src/posts/dto/post.input-dto';
import { BlogInputDto } from '../../../src/blogs/dto/blog.input-dto';
import { POSTS_PATH, BLOG_PATH } from '../../../src/core/paths/paths';

const app = express();
setupApp(app);

describe('Posts API with Blog Dependency', () => {
  const testBlogData: BlogInputDto = {
    name: 'Test Blog',
    description: "Test blog description",
    websiteUrl: "https://test-blog.com"
  };

  const testPostData: PostInputDto = {
    title: 'Test Post',
    shortDescription: 'Short description',
    content: 'Full content',
    blogId: '' // Будет заполнено перед тестами
  };

  let createdBlogId: string;
  let createdBlogName: string;

  beforeAll(async () => {
    // Очищаем данные
    await request(app)
      .delete('/api/testing/all-data')
      .expect(204);

    // Создаём блог для использования в тестах
    const blogResponse = await request(app)
      .post(BLOG_PATH)
      .send(testBlogData)
      .expect(201);

    createdBlogId = blogResponse.body.id;
    createdBlogName = blogResponse.body.name;
    testPostData.blogId = createdBlogId; // Заполняем blogId
  });

  it('✅ should create post with valid blogId', async () => {
    const response = await request(app)
      .post(POSTS_PATH)
      .send(testPostData)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(String),
      title: testPostData.title,
      shortDescription: testPostData.shortDescription,
      content: testPostData.content,
      blogId: createdBlogId,
      blogName: createdBlogName
    });
  });

  it('should return 400 when creating post with invalid blogId', async () => {
    const invalidPostData = {
      ...testPostData,
      blogId: 'non-existent-blog-id'
    };

    await request(app)
      .post(POSTS_PATH)
      .send(invalidPostData)
      .expect(400);
  });

  it('✅ should return posts with correct blog info', async () => {
    await request(app)
      .post(POSTS_PATH)
      .send(testPostData)
      .expect(201);

    const response = await request(app)
      .get(POSTS_PATH)
      .expect(200);

    expect(response.body[0].blogId).toBe(createdBlogId);
    expect(response.body[0].blogName).toBe(createdBlogName);
  });

  it('✅ should update post with new valid blogId', async () => {
    // Создаём второй блог
    const secondBlog = await request(app)
      .post(BLOG_PATH)
      .send({...testBlogData, name: 'Second Blog'})
      .expect(201);

    // Создаём пост
    const post = await request(app)
      .post(POSTS_PATH)
      .send(testPostData)
      .expect(201);

    // Обновляем пост с новым blogId
    const updateData = {
      ...testPostData,
      blogId: secondBlog.body.id
    };

    await request(app)
      .put(`${POSTS_PATH}/${post.body.id}`)
      .send(updateData)
      .expect(204);

    // Проверяем обновление
    const updatedPost = await request(app)
      .get(`${POSTS_PATH}/${post.body.id}`)
      .expect(200);

    expect(updatedPost.body.blogId).toBe(secondBlog.body.id);
    expect(updatedPost.body.blogName).toBe(secondBlog.body.name);
  });

  it('should return 404 when deleting non-existent post', async () => {
    await request(app)
      .delete(`${POSTS_PATH}/non-existent-post-id`)
      .expect(404);
  });
});