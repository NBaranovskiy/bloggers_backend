"use strict";
// src/routers/handlers/deletePostHandler.ts
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
exports.deletePostHandler = void 0;
const posts_repository_1 = require("../../repositories/posts.repository"); // Import your postsRepository
// We no longer need the in-memory database or createErrorMessages
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils";
const deletePostHandler = (// Make the function async
req, // Type req.params.id for clarity
res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id; // This 'id' is a string representing a MongoDB ObjectId
    try {
        // Use the postsRepository to delete the post by its MongoDB _id
        yield posts_repository_1.postsRepository.delete(postId);
        res.sendStatus(204); // Send 204 No Content for successful deletion
    }
    catch (error) {
        // Handle specific errors thrown by the repository
        if (error.message === 'Post not exist') {
            // This means the post with the given ID was not found
            res.sendStatus(404); // Send 404 Not Found
        }
        else {
            // Log any other unexpected errors and send a 500
            console.error('Error deleting post:', error);
            res.sendStatus(500); // Internal Server Error
        }
    }
});
exports.deletePostHandler = deletePostHandler;
