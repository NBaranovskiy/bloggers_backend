"use strict";
// src/routers/handlers/updatePostHandler.ts
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
exports.updatePostHandler = void 0;
const posts_repository_1 = require("../../repositories/posts.repository"); // Import your postsRepository
const updatePostHandler = (// Make the function async
req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id; // This 'id' is now a MongoDB ObjectId string
    // All validation (including PostInputDtoValidation and blogId existence)
    // is now handled by middleware *before* this handler is called.
    // So, no need to run validation or check for errors here.
    const updateData = req.body;
    try {
        // Use the postsRepository to update the post by its MongoDB _id
        yield posts_repository_1.postsRepository.update(postId, updateData);
        res.sendStatus(204); // Send 204 No Content for successful update
    }
    catch (error) {
        // Handle specific errors thrown by the repository
        if (error.message === 'Post not exist') {
            // This means the post with the given ID was not found
            res.sendStatus(404); // Send 404 Not Found
        }
        else {
            // Log any other unexpected errors and send a 500
            console.error('Error updating post:', error);
            res.sendStatus(500); // Internal Server Error
        }
    }
});
exports.updatePostHandler = updatePostHandler;
