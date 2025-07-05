// src/routers/handlers/getBlogsListHandler.ts

import { Request, Response } from 'express';
import { bloggersRepository } from '../../repositories/bloggers.repository';
import {blogsServices} from "../../application/blogs.services";
import {BlogQueryDto} from "../../dto/blog.input-dto"; // Import your bloggersRepository

// We no longer need the in-memory database import
// import { db } from "../../../db/in-memory.db";

export const getBlogsListHandler = async (req: Request, res: Response) => {
    const queryDto: BlogQueryDto = {
        searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
        sortDirection: req.query.sortDirection ? String(req.query.sortDirection) as 'asc' | 'desc' : undefined,
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };

    try {
        const result = await blogsServices.findAll(queryDto);
        res.status(200).json(result);
    } catch (error) {
        res.sendStatus(500)
    }
};