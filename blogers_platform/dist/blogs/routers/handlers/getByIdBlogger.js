"use strict";
// src/routers/handlers/getByIdBlogger.ts
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
exports.getByIdBlogger = void 0;
const bloggers_repository_1 = require("../../repositories/bloggers.repository"); // Import your bloggersRepository
// We no longer need these imports for the in-memory DB or manual error messages
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils"
const getByIdBlogger = (// Make the function async
req, // Type req.params.id
res) => __awaiter(void 0, void 0, void 0, function* () {
    const bloggerId = req.params.id; // This 'id' is a string representing a MongoDB ObjectId
    // Fetch the blogger from MongoDB using the repository
    const blogger = yield bloggers_repository_1.bloggersRepository.findById(bloggerId);
    if (!blogger) {
        // If the blogger is not found, send a 404 response
        res.sendStatus(404); // Using sendStatus is concise for common status codes
        return;
    }
    // If the blogger is found, send it with a 200 status
    res.status(200).json(blogger); // Use .json() for sending JSON data
});
exports.getByIdBlogger = getByIdBlogger;
