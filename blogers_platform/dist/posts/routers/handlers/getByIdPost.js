"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByIdPost = getByIdPost;
const in_memory_db_1 = require("../../../db/in-memory.db");
const error_utils_1 = require("../../../core/utils/error.utils");
function getByIdPost(req, res) {
    const id = req.params.id;
    const post = in_memory_db_1.db.posts.find(d => d.id === id);
    if (!post) {
        res.status(404).send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Post not found' }]));
        return;
    }
    res.status(200).send(post);
}
