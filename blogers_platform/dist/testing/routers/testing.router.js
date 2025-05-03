"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const deleteAllData_1 = require("./handlers/deleteAllData");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter
    .delete('/all-data', deleteAllData_1.deleteAllData);
