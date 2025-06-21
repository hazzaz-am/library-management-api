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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const book_zod_1 = require("../zodSchema/book.zod");
exports.booksRoutes = express_1.default.Router();
// create a book
exports.booksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield book_zod_1.ZBook.parseAsync(req.body);
        const book = yield book_model_1.Book.create(body);
        res.json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
// get books
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sort, limit, sortBy } = req.query;
        const query = typeof filter === "string" ? { genre: filter } : {};
        const sortDirection = sort === "desc" ? -1 : 1;
        const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
        const resultLimit = typeof limit === "string" ? parseInt(limit) : 10;
        // query books
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortField]: sortDirection })
            .limit(resultLimit);
        res.json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
// get a single book
exports.booksRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        // query single book
        const book = yield book_model_1.Book.findById(id);
        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
// update a book
exports.booksRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        const body = req.body;
        // query single book
        const book = yield book_model_1.Book.findByIdAndUpdate(id, body, { new: true });
        res.json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
// delete a book
exports.booksRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.bookId;
        // delete a book
        const book = yield book_model_1.Book.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Book deleted successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error,
        });
    }
}));
