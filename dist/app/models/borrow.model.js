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
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const book_model_1 = require("./book.model");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Book's ID is required"],
        ref: "Book",
    },
    quantity: {
        type: Number,
        min: [1, "Quantity must be positive and at least 1"],
        required: [true, "Quantity is required"],
    },
    dueDate: {
        type: Date,
        required: [true, "Must have the date by which the book returned"],
    },
}, {
    timestamps: true,
    versionKey: false,
});
// instance methods
borrowSchema.static("updateAvailability", function (bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield book_model_1.Book.findById(bookId);
        if (book && book.copies === 0 && book.available) {
            yield book_model_1.Book.findByIdAndUpdate(bookId, { available: false });
        }
    });
});
// hooks middleware
borrowSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield book_model_1.Book.findById(this.book);
        if (!book) {
            return next(new Error("Book not found"));
        }
        if (book.copies < this.quantity) {
            return next(new Error("Not enough copies available"));
        }
        next();
    });
});
borrowSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield book_model_1.Book.updateOne({ _id: doc.book }, { $inc: { copies: -doc.quantity } });
        exports.Borrow.updateAvailability(doc.book);
        next();
    });
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
