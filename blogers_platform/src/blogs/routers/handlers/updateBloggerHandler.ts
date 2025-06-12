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
    const isUpdated = await bloggersRepository.update(bloggerId,updateData)

    if (!isUpdated){
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
};