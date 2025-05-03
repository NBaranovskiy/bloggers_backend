"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogHandler = createBlogHandler;
const in_memory_db_1 = require("../../../db/in-memory.db");
const BlogInputDtoValidation_1 = require("../../validation/BlogInputDtoValidation");
const error_utils_1 = require("../../../core/utils/error.utils");
function createBlogHandler(req, res) {
    const errors = (0, BlogInputDtoValidation_1.BlogInputDtoValidation)(req.body);
    if (errors.length > 0) {
        res.status(400).send((0, error_utils_1.createErrorMessages)(errors));
        return;
    }
    const newBlogger = {
        id: in_memory_db_1.db.bloggers.length ? String(in_memory_db_1.db.bloggers[in_memory_db_1.db.bloggers.length - 1].id + 1) : "1",
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    };
    in_memory_db_1.db.bloggers.push(newBlogger);
    res.status(201).send(newBlogger);
}
;
