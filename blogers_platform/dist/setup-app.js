"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApp = void 0;
const express_1 = __importDefault(require("express"));
const blog_router_1 = require("./blogs/routers/blog.router");
const testing_router_1 = require("./testing/routers/testing.router");
const post_router_1 = require("./posts/routers/post.router");
const paths_1 = require("./core/paths/paths");
const setupApp = (app) => {
    app.use(express_1.default.json());
    app.get('/', (req, res) => {
        res.status(200).send('hello world!!!');
    });
    app.use(paths_1.BLOG_PATH, blog_router_1.blogRouter);
    app.use(paths_1.TESTING_PATH, testing_router_1.testingRouter);
    app.use(paths_1.POSTS_PATH, post_router_1.postsRouter);
    return app;
};
exports.setupApp = setupApp;
