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
        errors.push({ message: 'Invalid title', field: 'title' });
    }
    if (!data.shortDescription ||
        typeof data.shortDescription !== 'string' ||
        data.shortDescription.trim().length < 2 ||
        data.shortDescription.trim().length > 100) {
        errors.push({ message: 'Invalid shortDescription', field: 'shortDescription' });
    }
    if (!data.content ||
        typeof data.content !== 'string' ||
        data.content.trim().length < 2 ||
        data.content.trim().length > 1000) {
        errors.push({ message: 'Invalid content', field: 'content' });
    }
    if (!data.blogId ||
        typeof data.blogId !== 'string' ||
        in_memory_db_1.db.bloggers.findIndex(d => d.id === data.blogId) === -1) {
        errors.push({ message: 'Invalid blogId', field: 'blogId' });
    }
    return errors;
};
exports.PostInputDtoValidation = PostInputDtoValidation;
