"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const book_controllers_1 = require("./app/controllers/book.controllers");
const borrow_controllers_1 = require("./app/controllers/borrow.controllers");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use("/api/books", book_controllers_1.booksRoutes);
exports.app.use("/api/borrow", borrow_controllers_1.borrowRoutes);
exports.app.get("/", (_req, res) => {
    res.json({
        message: "OK",
    });
});
