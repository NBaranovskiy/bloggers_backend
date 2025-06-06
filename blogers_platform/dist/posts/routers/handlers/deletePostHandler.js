"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostHandler = deletePostHandler;
const in_memory_db_1 = require("../../../db/in-memory.db");
const error_utils_1 = require("../../../core/utils/error.utils");
function deletePostHandler(req, res) {
    const id = req.params.id;
    const index = in_memory_db_1.db.posts.findIndex(d => d.id === id);
    if (index === -1) {
        res.status(404).send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Post not found' }]));
        return;
    }
    ;
    in_memory_db_1.db.posts.splice(index, 1);
    res.sendStatus(204);
}
;
