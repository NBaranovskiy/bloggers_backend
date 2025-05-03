"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const getByIdBlogger_1 = require("./handlers/getByIdBlogger");
const getBlogsListHandler_1 = require("./handlers/getBlogsListHandler");
const createBlogHandler_1 = require("./handlers/createBlogHandler");
const updateBloggerHandler_1 = require("./handlers/updateBloggerHandler");
const deleteBloggerHandler_1 = require("./handlers/deleteBloggerHandler");
exports.blogRouter = (0, express_1.Router)({});
exports.blogRouter
    .get('', getBlogsListHandler_1.getBlogsListHandler)
    .post('', createBlogHandler_1.createBlogHandler)
    .get('/:id', getByIdBlogger_1.getByIdBlogger)
    .put('/:id', updateBloggerHandler_1.updateBloggerHandler)
    .delete('/:id', deleteBloggerHandler_1.deleteBloggerHandler);
