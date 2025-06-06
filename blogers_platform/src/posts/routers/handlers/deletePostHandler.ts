// src/routers/handlers/deletePostHandler.ts

import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository'; // Import your postsRepository

// We no longer need the in-memory database or createErrorMessages
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils";

export const deletePostHandler = async ( // Make the function async
    req: Request<{id: string}>, // Type req.params.id for clarity
    res: Response
) => {
    const postId = req.params.id; // This 'id' is a string representing a MongoDB ObjectId

    try {
        // Use the postsRepository to delete the post by its MongoDB _id
        await postsRepository.delete(postId);
        res.sendStatus(204); // Send 204 No Content for successful deletion
    } catch (error: any) {
        // Handle specific errors thrown by the repository
        if (error.message === 'Post not exist') {
            // This means the post with the given ID was not found
            res.sendStatus(404); // Send 404 Not Found
        } else {
            // Log any other unexpected errors and send a 500
            console.error('Error deleting post:', error);
            res.sendStatus(500); // Internal Server Error
        }
    }
};