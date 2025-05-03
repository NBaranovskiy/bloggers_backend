"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
exports.deleteAllData = deleteAllData;
const express_1 = require("express");
const in_memory_db_1 = require("../../../db/in-memory.db");
exports.testingRouter = (0, express_1.Router)({});
function deleteAllData(req, res) {
    in_memory_db_1.db.posts = [];
    in_memory_db_1.db.bloggers = [];
    res.sendStatus(204);
}
;
