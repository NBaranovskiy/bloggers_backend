"use strict";
// src/routers/testing-router.ts
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
exports.deleteAllData = exports.testingRouter = void 0;
const express_1 = require("express");
const mongo_db_1 = require("../../../db/mongo.db"); // Import your MongoDB collections
exports.testingRouter = (0, express_1.Router)({});
const deleteAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete all documents from the bloggers collection
        yield mongo_db_1.bloggersCollection.deleteMany({});
        // Delete all documents from the posts collection
        yield mongo_db_1.postsCollection.deleteMany({});
        res.sendStatus(204); // Send 204 No Content for successful deletion
    }
    catch (error) {
        console.error('Error deleting all data:', error);
        res.sendStatus(500); // Send 500 Internal Server Error if something goes wrong
    }
});
exports.deleteAllData = deleteAllData;
// Register the handler with the router
exports.testingRouter.delete('/all-data', exports.deleteAllData); // Assuming you want a DELETE /all-data endpoint
