import { Request, Response } from 'express';
import {BlogInputDto} from "../../dto/blog.input-dto";
import {db} from "../../../db/in-memory.db";
import {BlogInputDtoValidation} from "../../validation/BlogInputDtoValidation";
import {createErrorMessages} from "../../../core/utils/error.utils"
import {Blogger} from "../../types/blogger";

export function createBlogHandler(
  req: Request<{}, {}, BlogInputDto>,
  res: Response,
) {
  const errors = BlogInputDtoValidation(req.body);

  if (errors.length > 0) {
    res.status(400).send(createErrorMessages(errors))
    return;
  }

  const newBlogger: Blogger = {
    id: db.bloggers.length ? String(db.bloggers[db.bloggers.length - 1].id + 1) : "1",
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl
  };

  db.bloggers.push(newBlogger);
  res.status(201).send(newBlogger);
};