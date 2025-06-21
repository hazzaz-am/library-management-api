"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Book title is required"],
    },
    author: {
        type: String,
        trim: true,
        required: [true, "Book has to be an author"],
    },
    genre: {
        type: String,
        uppercase: true,
        trim: true,
        enum: {
            values: [
                "FICTION",
                "NON_FICTION",
                "SCIENCE",
                "HISTORY",
                "BIOGRAPHY",
                "FANTASY",
            ],
            message: "{VALUE} is not supported. Must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
        },
    },
    isbn: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "ISBN number is required"],
    },
    description: {
        type: String,
        trim: true,
    },
    copies: {
        type: Number,
        min: [0, "Copies must be a positive number"],
        required: [true, "Total copies is required"],
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
