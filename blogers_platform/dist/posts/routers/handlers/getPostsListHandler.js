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
const posts_services_1 = require("../../application/posts.services");
const getPostsListHandler = (req, // Типизируем req.query
res // Типизируем ответ
) => __awaiter(void 0, void 0, void 0, function* () {
    const queryDto = {
        searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined,
        searchContentTerm: req.query.searchContentTerm ? String(req.query.searchContentTerm) : undefined,
        blogId: req.query.blogId ? String(req.query.blogId) : undefined,
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };
    if (queryDto.pageNumber && isNaN(queryDto.pageNumber)) {
        res.status(400).json({ message: "pageNumber must be a number." });
    }
    if (queryDto.pageSize && isNaN(queryDto.pageSize)) {
        res.status(400).json({ message: "pageSize must be a number." });
    }
    try {
        // 3. Вызываем СЕРВИСный метод findAll, передавая ему подготовленный queryDto.
        // Сервис вернет объект Paged<Post>.
        const result = yield posts_services_1.postsServices.findAll(queryDto);
        // 4. Отправляем успешный ответ со статусом 200 OK и данными.
        res.status(200).json(result);
    }
    catch (error) {
        // 5. Обработка ошибок.
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getPostsListHandler = getPostsListHandler;
