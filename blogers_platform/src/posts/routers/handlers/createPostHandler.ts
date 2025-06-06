// src/routers/handlers/createPostHandler.ts

import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository'; // Import your postsRepository
import { PostInputDto } from '../../dto/post.input-dto'; // Import your DTO

// We no longer need these imports for manual validation or in-memory DB
// import { PostInputDtoValidation } from "../../validation/PostInputDtoValidation";
// import { createErrorMessages } from "../../../core/utils/error.utils";
// import { Post } from "../../types/post"; // postsRepository handles object creation now
// import { db } from "../../../db/in-memory.db";

export const createPostHandler = async ( // Make the function async
    req: Request<{}, {}, PostInputDto>, // Type the request body
    res: Response
) => {
    // All validation is now handled by middleware (postInputValidation, handleValidationErrors)
    // before this handler is called. If there are validation errors,
    // handleValidationErrors will already send a 400 response.

    const { title, shortDescription, content, blogId } = req.body;

    // Use the postsRepository to create the new post in MongoDB.
    // The repository handles assigning _id, createdAt, and fetching blogName.
    try {
        const newPost = await postsRepository.create({
            title,
            shortDescription,
            content,
            blogId
        });

        res.status(201).json(newPost); // Send the created post with a 201 status
    } catch (error: any) {
        // This catch block handles potential errors during the creation process,
        // e.g., if the associated blog was not found (though validation should catch this).
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post due to an internal error.' });
    }
};