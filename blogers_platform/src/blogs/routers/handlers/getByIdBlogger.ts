// src/routers/handlers/getByIdBlogger.ts

import { Request, Response } from 'express';
import { bloggersRepository } from '../../repositories/bloggers.repository'; // Import your bloggersRepository

// We no longer need these imports for the in-memory DB or manual error messages
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils"

export const getByIdBlogger = async ( // Make the function async
    req: Request<{id: string}>, // Type req.params.id
    res: Response
) => {
    const bloggerId = req.params.id; // This 'id' is a string representing a MongoDB ObjectId

    // Fetch the blogger from MongoDB using the repository
    const blogger = await bloggersRepository.findById(bloggerId);

    if (!blogger) {
        // If the blogger is not found, send a 404 response
        res.sendStatus(404); // Using sendStatus is concise for common status codes
        return;
    }

    // If the blogger is found, send it with a 200 status
    res.status(200).json(blogger); // Use .json() for sending JSON data
};