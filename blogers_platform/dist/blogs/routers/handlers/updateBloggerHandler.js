"use strict";
// src/routers/handlers/updateBloggerHandler.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBloggerHandler = void 0;
const bloggers_repository_1 = require("../../repositories/bloggers.repository"); // Import your bloggersRepository
// We no longer need these imports for manual validation or in-memory DB
// import { db } from "../../../db/in-memory.db";
// import { BlogInputDtoValidation } from "../../validation/BlogInputDtoValidation";
// import { createErrorMessages } from "../../../core/utils/error.utils";
// import { Blogger } from "../../types/blogger"; // bloggersRepository handles object updates
const updateBloggerHandler = (// Make the function async
req, // Type the request parameters and body
res) => __awaiter(void 0, void 0, void 0, function* () {
    const bloggerId = req.params.id; // This 'id' is now a MongoDB ObjectId string
    // All validation (including BlogInputDtoValidation) is now handled by middleware
    // (blogInputValidation, handleValidationErrors) *before* this handler is called.
    // If there are validation errors, handleValidationErrors will already send a 400 response.
    // So, no need to run validation or check for errors here.
    const updateData = req.body;
    const isUpdated = yield bloggers_repository_1.bloggersRepository.update(bloggerId, updateData);
    if (!isUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
});
exports.updateBloggerHandler = updateBloggerHandler;
