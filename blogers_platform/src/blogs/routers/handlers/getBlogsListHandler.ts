// src/routers/handlers/getBlogsListHandler.ts

import { Request, Response } from 'express';
import { bloggersRepository } from '../../repositories/bloggers.repository'; // Import your bloggersRepository

// We no longer need the in-memory database import
// import { db } from "../../../db/in-memory.db";

export const getBlogsListHandler = async (req: Request, res: Response) => { // Make the function async
    // Fetch all blogs from MongoDB using the repository
    const blogs = await bloggersRepository.findAll();

    // Send the retrieved blogs in the response
    res.status(200).json(blogs); // Use .json() for sending JSON data
};