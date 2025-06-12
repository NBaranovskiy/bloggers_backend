"use strict";
// src/routers/handlers/createPostHandler.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostHandler = void 0;
const posts_repository_1 = require("../../repositories/posts.repository"); // Import your postsRepository
// We no longer need these imports for manual validation or in-memory DB
// import { PostInputDtoValidation } from "../../validation/PostInputDtoValidation";
// import { createErrorMessages } from "../../../core/utils/error.utils";
// import { Post } from "../../types/post"; // postsRepository handles object creation now
// import { db } from "../../../db/in-memory.db";
const createPostHandler = (// Make the function async
req, // Type the request body
res) => __awaiter(void 0, void 0, void 0, function* () {
    // All validation is now handled by middleware (postInputValidation, handleValidationErrors)
    // before this handler is called. If there are validation errors,
    // handleValidationErrors will already send a 400 response.
    const { title, shortDescription, content, blogId } = req.body;
    // Use the postsRepository to create the new post in MongoDB.
    // The repository handles assigning _id, createdAt, and fetching blogName.
    try {
        const newPost = yield posts_repository_1.postsRepository.create({
            title,
            shortDescription,
            content,
            blogId
        });
        const { _id } = newPost, postWithoutId = __rest(newPost, ["_id"]);
        res.status(201).json(postWithoutId); // Send the created post with a 201 status
    }
    catch (error) {
        // This catch block handles potential errors during the creation process,
        // e.g., if the associated blog was not found (though validation should catch this).
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post due to an internal error.' });
    }
});
exports.createPostHandler = createPostHandler;
