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
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_zod_1 = require("../zodSchema/borrow.zod");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRoutes = express_1.default.Router();
// create a book
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield borrow_zod_1.ZBorrow.parseAsync(req.body);
        const borrow = new borrow_model_1.Borrow(body);
        const borrowedBook = yield borrow.save();
        res.json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowedBook,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: Object.keys(error).length === 0 ? "Couldn't borrow a book" : error,
        });
    }
}));
// get borrowed books
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield borrow_model_1.Borrow.aggregate([
            // group pipeline
            {
                $group: {
                    _id: "$book",
                    totalQuantity: {
                        $sum: "$quantity",
                    },
                },
            },
            // lookup pipeline
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            // unwind pipeline
            {
                $unwind: "$bookInfo",
            },
            // project pipeline
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn",
                    },
                },
            },
        ]);
        res.json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
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
