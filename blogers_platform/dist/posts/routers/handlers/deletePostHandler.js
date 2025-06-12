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
exports.deletePostHandler = void 0;
const posts_repository_1 = require("../../../posts/repositories/posts.repository"); // <-- Check this path carefully
const deletePostHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const isDeleted = yield posts_repository_1.postsRepository.delete(postId); // Получаем boolean
    if (!isDeleted) {
        res.status(404); // Пост не найден
        return;
    }
    res.status(204); // Успешно удалено
    return;
});
exports.deletePostHandler = deletePostHandler;
