import {PostInputDto} from "../../dto/post.input-dto";
import { Request, Response } from 'express';
import {PostInputDtoValidation} from "../../validation/PostInputDtoValidation"
import {createErrorMessages} from "../../../core/utils/error.utils";
import {Post} from "../../types/post";
import {db} from "../../../db/in-memory.db";

export function createPostHandler(
    req: Request<{},{},PostInputDto>,
    res: Response
) {
    const errors = PostInputDtoValidation(req.body);

  if (errors.length > 0) {
    res.status(400).send(createErrorMessages(errors))
    return;
  }
  const newPost: Post = {
      id: db.posts.length ? String(db.posts[db.posts.length - 1].id + 1) : "1",
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId: req.body.blogId,
      blogName: db.bloggers[db.bloggers.findIndex(d => d.id === req.body.blogId)].name
  };

  db.posts.push(newPost);
  res.status(201).send(newPost)
}
