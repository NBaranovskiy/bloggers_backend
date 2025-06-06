// src/routers/handlers/updateBloggerHandler.ts

import { Request, Response } from 'express';
import { bloggersRepository } from '../../repositories/bloggers.repository'; // Import your bloggersRepository
import { BlogInputDto } from '../../dto/blog.input-dto'; // Import your DTO

// We no longer need these imports for manual validation or in-memory DB
// import { db } from "../../../db/in-memory.db";
// import { BlogInputDtoValidation } from "../../validation/BlogInputDtoValidation";
// import { createErrorMessages } from "../../../core/utils/error.utils";
// import { Blogger } from "../../types/blogger"; // bloggersRepository handles object updates

export const updateBloggerHandler = async ( // Make the function async
    req: Request<{id: string}, {}, BlogInputDto>, // Type the request parameters and body
    res: Response
) => {
    const bloggerId = req.params.id; // This 'id' is now a MongoDB ObjectId string

    // All validation (including BlogInputDtoValidation) is now handled by middleware
    // (blogInputValidation, handleValidationErrors) *before* this handler is called.
    // If there are validation errors, handleValidationErrors will already send a 400 response.
    // So, no need to run validation or check for errors here.

    const updateData = req.body;

    try {
        // Use the bloggersRepository to update the blog by its MongoDB _id
        await bloggersRepository.update(bloggerId, updateData);
        res.sendStatus(204); // Send 204 No Content for successful update
    } catch (error: any) {
        // Handle specific errors thrown by the repository
        if (error.message === 'Blogger not exist') {
            // This means the blog with the given ID was not found
            res.sendStatus(404); // Send 404 Not Found
        } else {
            // Log any other unexpected errors and send a 500
            console.error('Error updating blogger:', error);
            res.sendStatus(500); // Internal Server Error
        }
    }
};