"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const getPostsListHandler_1 = require("./handlers/getPostsListHandler");
const createPostHandler_1 = require("./handlers/createPostHandler");
const getByIdPost_1 = require("./handlers/getByIdPost");
const updatePostHandler_1 = require("./handlers/updatePostHandler");
const deletePostHandler_1 = require("./handlers/deletePostHandler");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter
    .get('', getPostsListHandler_1.getPostsListHandler)
    .post('', createPostHandler_1.createPostHandler)
    .get('/:id', getByIdPost_1.getByIdPost)
    .put('/:id', updatePostHandler_1.updatePostHandler)
    .delete('/:id', deletePostHandler_1.deletePostHandler);
