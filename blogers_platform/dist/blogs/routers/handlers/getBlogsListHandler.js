"use strict";
// src/routers/handlers/getBlogsListHandler.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogsListHandler = void 0;
const bloggers_repository_1 = require("../../repositories/bloggers.repository"); // Import your bloggersRepository
// We no longer need the in-memory database import
// import { db } from "../../../db/in-memory.db";
const getBlogsListHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all blogs from MongoDB using the repository
    const blogs = yield bloggers_repository_1.bloggersRepository.findAll();
    // Send the retrieved blogs in the response
    res.status(200).json(blogs); // Use .json() for sending JSON data
});
exports.getBlogsListHandler = getBlogsListHandler;
