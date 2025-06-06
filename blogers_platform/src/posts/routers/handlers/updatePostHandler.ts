// src/routers/handlers/updatePostHandler.ts

import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository'; // Import your postsRepository
import { PostInputDto } from '../../dto/post.input-dto'; // Import your DTO


export const updatePostHandler = async ( // Make the function async
    req: Request<{id: string}, {}, PostInputDto>,
    res: Response
) => {
    const postId = req.params.id; // This 'id' is now a MongoDB ObjectId string

    // All validation (including PostInputDtoValidation and blogId existence)
    // is now handled by middleware *before* this handler is called.
    // So, no need to run validation or check for errors here.

    const updateData = req.body;

    try {
        // Use the postsRepository to update the post by its MongoDB _id
        await postsRepository.update(postId, updateData);
        res.sendStatus(204); // Send 204 No Content for successful update
    } catch (error: any) {
        // Handle specific errors thrown by the repository
        if (error.message === 'Post not exist') {
            // This means the post with the given ID was not found
            res.sendStatus(404); // Send 404 Not Found
        } else {
            // Log any other unexpected errors and send a 500
            console.error('Error updating post:', error);
            res.sendStatus(500); // Internal Server Error
        }
    }
};