"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByIdBlogger = getByIdBlogger;
const in_memory_db_1 = require("../../../db/in-memory.db");
const error_utils_1 = require("../../../core/utils/error.utils");
function getByIdBlogger(req, res) {
    const id = req.params.id;
    const blogger = in_memory_db_1.db.bloggers.find(d => d.id === id);
    if (!blogger) {
        res.status(404).send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'Driver not found' }]));
        return;
    }
    res.status(200).send(blogger);
}
