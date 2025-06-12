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

    const isUpdated = await postsRepository.update(postId,updateData)

    if(!isUpdated){
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
};