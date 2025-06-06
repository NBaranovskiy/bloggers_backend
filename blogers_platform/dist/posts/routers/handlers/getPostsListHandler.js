"use strict";
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
exports.getPostsListHandler = void 0;
const posts_repository_1 = require("../../repositories/posts.repository"); // Import your postsRepository
const getPostsListHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all posts from MongoDB using the repository
    const posts = yield posts_repository_1.postsRepository.findAll();
    // Send the retrieved posts in the response
    res.status(200).json(posts); // Use .json() for sending JSON data
});
exports.getPostsListHandler = getPostsListHandler;
