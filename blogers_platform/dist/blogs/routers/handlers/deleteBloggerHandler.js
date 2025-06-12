"use strict";
// src/routers/handlers/deleteBloggerHandler.ts
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
exports.deleteBloggerHandler = void 0;
const bloggers_repository_1 = require("../../repositories/bloggers.repository");
// We no longer need the in-memory database or createErrorMessages
// import {db} from "../../../db/in-memory.db";
// import {createErrorMessages} from "../../../core/utils/error.utils";
const deleteBloggerHandler = (// Make the function async
req, // Type req.params.id for clarity
res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const isDeleted = yield bloggers_repository_1.bloggersRepository.delete(blogId); // Получаем boolean
    if (!isDeleted) {
        res.sendStatus(404); // Пост не найден
        return;
    }
    res.sendStatus(204); // Успешно удалено
    return;
});
exports.deleteBloggerHandler = deleteBloggerHandler;
