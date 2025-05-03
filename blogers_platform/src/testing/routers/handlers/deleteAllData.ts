import {Request,Response,Router} from "express";
import { db } from '../../../db/in-memory.db';

export const testingRouter = Router({});

export function deleteAllData(req:Request,res:Response){
    db.posts = [];
    db.bloggers = [];
    res.sendStatus(204);
};