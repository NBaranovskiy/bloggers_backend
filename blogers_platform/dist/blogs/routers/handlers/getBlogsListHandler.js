"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogsListHandler = getBlogsListHandler;
const in_memory_db_1 = require("../../../db/in-memory.db");
function getBlogsListHandler(req, res) {
    res.status(200).send(in_memory_db_1.db.bloggers);
}
