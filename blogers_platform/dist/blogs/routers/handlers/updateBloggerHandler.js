"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBloggerHandler = updateBloggerHandler;
const in_memory_db_1 = require("../../../db/in-memory.db");
const BlogInputDtoValidation_1 = require("../../validation/BlogInputDtoValidation");
const error_utils_1 = require("../../../core/utils/error.utils");
function updateBloggerHandler(req, res) {
    const id = req.params.id;
    const index = in_memory_db_1.db.bloggers.findIndex(d => d.id === id);
    if (index === -1) {
        res.status(404).send((0, error_utils_1.createErrorMessages)([{ field: 'id', message: 'blog not found' }]));
        return;
    }
    const errors = (0, BlogInputDtoValidation_1.BlogInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(400).send((0, error_utils_1.createErrorMessages)(errors));
        return;
    }
    const blogger = in_memory_db_1.db.bloggers[index];
    blogger.name = req.body.name;
    blogger.description = req.body.description;
    blogger.websiteUrl = req.body.websiteUrl;
    res.sendStatus(204);
}
