"use strict";
// src/routers/handlers/getByIdPost.ts
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
exports.getByIdPost = void 0;
const posts_repository_1 = require("../../repositories/posts.repository"); // Import your postsRepository
// We no longer need these as we're using MongoDB and express-validator middleware
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils"
const getByIdPost = (// Make the function async
req, // Type req.params.id
res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id; // This 'id' is a string representing a MongoDB ObjectId
    // Fetch the post from MongoDB using the repository
    const post = yield posts_repository_1.postsRepository.findById(postId);
    if (!post) {
        // If the post is not found, send a 404 response
        res.sendStatus(404); // Using sendStatus is concise for common status codes
        return;
    }
    // If the post is found, send it with a 200 status
    res.status(200).json(post); // Use .json() for sending JSON data
});
exports.getByIdPost = getByIdPost;
