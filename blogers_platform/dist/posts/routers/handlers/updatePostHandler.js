"use strict";
// src/routers/handlers/updatePostHandler.ts
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
exports.updatePostHandler = void 0;
const posts_services_1 = require("../../application/posts.services"); // Import your DTO
const updatePostHandler = (// Make the function async
req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id; // This 'id' is now a MongoDB ObjectId string
    // All validation (including PostInputDtoValidation and blogId existence)
    // is now handled by middleware *before* this handler is called.
    // So, no need to run validation or check for errors here.
    const updateData = req.body;
    const isUpdated = yield posts_services_1.postsServices.update(postId, updateData);
    if (!isUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
});
exports.updatePostHandler = updatePostHandler;
