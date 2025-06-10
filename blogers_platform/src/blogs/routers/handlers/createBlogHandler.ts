// src/routers/handlers/createBlogHandler.ts

import { Request, Response } from 'express';
import { BlogInputDto } from '../../dto/blog.input-dto'; // Import your DTO
import { bloggersRepository } from '../../repositories/bloggers.repository'; // Import your bloggersRepository

// We no longer need these imports for manual validation or the in-memory DB
// import { db } from "../../../db/in-memory.db";
// import { BlogInputDtoValidation } from "../../validation/BlogInputDtoValidation";
// import { createErrorMessages } from "../../../core/utils/error.utils";
// import { Blogger } from "../../types/blogger"; // bloggersRepository handles object creation now

export const createBlogHandler = async ( // Make the function async
    req: Request<{}, {}, BlogInputDto>, // Type the request body
    res: Response
) => {
    // All validation is now handled by middleware (blogInputValidation, handleValidationErrors)
    // before this handler is called. If there are validation errors,
    // handleValidationErrors will already send a 400 response.
    // So, no need to run validation or check for errors here.

    const { name, description, websiteUrl } = req.body;

    try {
        // Use the bloggersRepository to create the new blog in MongoDB.
        // The repository handles assigning _id, createdAt, and isMembership.
        const newBlog = await bloggersRepository.create({
            name,
            description,
            websiteUrl
        });
        const { _id, ...blogWithoutId } = newBlog;

        res.status(201).json(blogWithoutId); // Send the created blog with a 201 status
    } catch (error: any) {
        // This catch block handles potential errors during the creation process,
        // such as database connection issues.
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Failed to create blog due to an internal error.' });
    }
};