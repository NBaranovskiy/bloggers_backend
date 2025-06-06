import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository'; // Import your postsRepository

export const getPostsListHandler = async (req: Request, res: Response) => { // Make the function async
    // Fetch all posts from MongoDB using the repository
    const posts = await postsRepository.findAll();

    // Send the retrieved posts in the response
    res.status(200).json(posts); // Use .json() for sending JSON data
};