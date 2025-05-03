"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostHandler = createPostHandler;
const PostInputDtoValidation_1 = require("../../validation/PostInputDtoValidation");
const error_utils_1 = require("../../../core/utils/error.utils");
const in_memory_db_1 = require("../../../db/in-memory.db");
function createPostHandler(req, res) {
    const errors = (0, PostInputDtoValidation_1.PostInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(400).send((0, error_utils_1.createErrorMessages)(errors));
        return;
    }
    const newPost = {
        id: in_memory_db_1.db.posts.length ? String(in_memory_db_1.db.posts[in_memory_db_1.db.posts.length - 1].id + 1) : "1",
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: in_memory_db_1.db.bloggers[in_memory_db_1.db.bloggers.findIndex(d => d.id === req.body.blogId)].name
    };
    in_memory_db_1.db.posts.push(newPost);
    res.status(201).send(newPost);
}
