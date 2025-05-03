"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostInputDtoValidation = void 0;
const in_memory_db_1 = require("../../db/in-memory.db");
const PostInputDtoValidation = (data) => {
    const errors = [];
    if (!data.title ||
        typeof data.title !== 'string' ||
        data.title.trim().length < 2 ||
        data.title.trim().length > 30) {
        errors.push({ field: 'title', message: 'Invalid title' });
    }
    if (!data.shortDescription ||
        typeof data.shortDescription !== 'string' ||
        data.shortDescription.trim().length < 2 ||
        data.shortDescription.trim().length > 100) {
        errors.push({ field: 'shortDescription', message: 'Invalid shortDescription' });
    }
    if (!data.content ||
        typeof data.content !== 'string' ||
        data.content.trim().length < 2 ||
        data.content.trim().length > 1000) {
        errors.push({ field: 'content', message: 'Invalid content' });
    }
    if (!data.blogId ||
        typeof data.blogId !== 'string' ||
        in_memory_db_1.db.bloggers.findIndex(d => d.id === data.blogId) === -1) {
        errors.push({ field: 'blogId', message: 'Invalid blogId' });
    }
    return errors;
};
exports.PostInputDtoValidation = PostInputDtoValidation;
