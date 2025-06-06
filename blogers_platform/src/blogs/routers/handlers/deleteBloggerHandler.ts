// src/routers/handlers/deleteBloggerHandler.ts

import { Request, Response } from 'express';
import { bloggersRepository } from '../../repositories/bloggers.repository'; // Import your bloggersRepository

// We no longer need the in-memory database or createErrorMessages
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils";

export const deleteBloggerHandler = async ( // Make the function async
    req: Request<{id: string}>, // Type req.params.id for clarity
    res: Response
) => {
    const bloggerId = req.params.id; // This 'id' is a string representing a MongoDB ObjectId

    try {
        // Use the bloggersRepository to delete the blogger by its MongoDB _id
        await bloggersRepository.delete(bloggerId);
        res.sendStatus(204); // Send 204 No Content for successful deletion
    } catch (error: any) {
        // Handle specific errors thrown by the repository
        if (error.message === 'Blogger not exist') {
            // This means the blogger with the given ID was not found
            res.sendStatus(404); // Send 404 Not Found
        } else {
            // Log any other unexpected errors and send a 500
            console.error('Error deleting blogger:', error);
            res.sendStatus(500); // Internal Server Error
        }
    }
};