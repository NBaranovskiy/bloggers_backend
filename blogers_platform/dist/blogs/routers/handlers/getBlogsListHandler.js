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
const blogs_services_1 = require("../../application/blogs.services");
// We no longer need the in-memory database import
// import { db } from "../../../db/in-memory.db";
const getBlogsListHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryDto = {
        searchNameTerm: req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined,
        sortBy: req.query.sortBy ? String(req.query.sortBy) : undefined,
        sortDirection: req.query.sortDirection ? String(req.query.sortDirection) : undefined,
        pageNumber: req.query.pageNumber ? Number(req.query.pageNumber) : undefined,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    };
    try {
        const result = yield blogs_services_1.blogsServices.findAll(queryDto);
        res.status(200).json(result);
    }
    catch (error) {
        res.sendStatus(500);
    }
});
exports.getBlogsListHandler = getBlogsListHandler;
