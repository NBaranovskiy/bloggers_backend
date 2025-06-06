// src/routers/handlers/getByIdPost.ts

import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository'; // Import your postsRepository

// We no longer need these as we're using MongoDB and express-validator middleware
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils"

export const getByIdPost = async ( // Make the function async
    req: Request<{id: string}>, // Type req.params.id
    res: Response
) => {
    const postId = req.params.id; // This 'id' is a string representing a MongoDB ObjectId

    // Fetch the post from MongoDB using the repository
    const post = await postsRepository.findById(postId);

    if (!post) {
        // If the post is not found, send a 404 response
        res.sendStatus(404); // Using sendStatus is concise for common status codes
        return;
    }

    // If the post is found, send it with a 200 status
    res.status(200).json(post); // Use .json() for sending JSON data
};