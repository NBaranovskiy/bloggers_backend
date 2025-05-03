import { Request, Response } from 'express';
import {db} from "../../../db/in-memory.db";

export function getBlogsListHandler(
  req: Request,
  res: Response,
) {
  res.status(200).send(db.bloggers);
}