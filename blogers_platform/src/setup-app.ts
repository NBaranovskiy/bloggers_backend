import express, { Express } from 'express';
import { blogRouter } from "./blogs/routers/blog.router";
import { testingRouter } from './testing/routers/testing.router';
import { postsRouter } from './posts/routers/post.router';
import { BLOG_PATH, TESTING_PATH,POSTS_PATH } from './core/paths/paths';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('hello world!!!');
  });

  app.use(BLOG_PATH, blogRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(POSTS_PATH, postsRouter)

  return app;
};