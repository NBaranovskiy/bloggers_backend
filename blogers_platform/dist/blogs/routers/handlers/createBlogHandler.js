"use strict";
// src/routers/handlers/createBlogHandler.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogHandler = void 0;
const bloggers_repository_1 = require("../../repositories/bloggers.repository"); // Import your bloggersRepository
// We no longer need these imports for manual validation or the in-memory DB
// import { db } from "../../../db/in-memory.db";
// import { BlogInputDtoValidation } from "../../validation/BlogInputDtoValidation";
// import { createErrorMessages } from "../../../core/utils/error.utils";
// import { Blogger } from "../../types/blogger"; // bloggersRepository handles object creation now
const createBlogHandler = (// Make the function async
req, // Type the request body
res) => __awaiter(void 0, void 0, void 0, function* () {
    // All validation is now handled by middleware (blogInputValidation, handleValidationErrors)
    // before this handler is called. If there are validation errors,
    // handleValidationErrors will already send a 400 response.
    // So, no need to run validation or check for errors here.
    const { name, description, websiteUrl } = req.body;
    try {
        // Use the bloggersRepository to create the new blog in MongoDB.
        // The repository handles assigning _id, createdAt, and isMembership.
        const newBlog = yield bloggers_repository_1.bloggersRepository.create({
            name,
            description,
            websiteUrl
        });
        const { _id } = newBlog, blogWithoutId = __rest(newBlog, ["_id"]);
        res.status(201).json(blogWithoutId); // Send the created blog with a 201 status
    }
    catch (error) {
        // This catch block handles potential errors during the creation process,
        // such as database connection issues.
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Failed to create blog due to an internal error.' });
    }
});
exports.createBlogHandler = createBlogHandler;
