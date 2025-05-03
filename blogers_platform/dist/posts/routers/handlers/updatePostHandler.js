"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostHandler = updatePostHandler;
const in_memory_db_1 = require("../../../db/in-memory.db");
const PostInputDtoValidation_1 = require("../../validation/PostInputDtoValidation");
const error_utils_1 = require("../../../core/utils/error.utils");
function updatePostHandler(req, res) {
    const id = req.params.id;
    const index = in_memory_db_1.db.posts.findIndex(d => d.id === id);
    if (index === -1) {
        res.status(404).send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Post not found' }]));
        return;
    }
    const errors = (0, PostInputDtoValidation_1.PostInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(400).send((0, error_utils_1.createErrorMessages)(errors));
        return;
    }
    const Post = in_memory_db_1.db.posts[index];
    Post.title = req.body.title;
    Post.shortDescription = req.body.shortDescription;
    Post.content = req.body.content;
    Post.blogId = req.body.blogId;
    Post.blogName = in_memory_db_1.db.bloggers[in_memory_db_1.db.bloggers.findIndex(d => d.id === req.body.blogId)].name;
    res.sendStatus(204);
}
;
