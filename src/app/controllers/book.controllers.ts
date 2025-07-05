import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { ZBook } from "../zodSchema/book.zod";

export const booksRoutes = express.Router();

// create a book
booksRoutes.post("/", async (req: Request, res: Response) => {
	try {
		const body = await ZBook.parseAsync(req.body);
		const book = await Book.create(body);

		res.json({
			success: true,
			message: "Book created successfully",
			data: book,
		});
	} catch (error) {
		res.status(400).json({
			message: "Validation failed",
			success: false,
			error,
		});
	}
});

// get books
booksRoutes.get("/", async (req: Request, res: Response) => {
	try {
		const { filter, sort, limit, sortBy, page } = req.query;

		const query = typeof filter === "string" ? { genre: filter } : {};
		const sortDirection = sort === "desc" ? -1 : 1;
		const sortField = typeof sortBy === "string" ? sortBy : "createdAt";
		const resultLimit = typeof limit === "string" ? parseInt(limit) : 10;
		const currentPage = typeof page === "string" ? parseInt(page) : 1;
		const skipCount = (currentPage - 1) * resultLimit;

		const books = await Book.find(query)
			.sort({ [sortField]: sortDirection })
			.skip(skipCount)
			.limit(resultLimit);

		const totalCount = await Book.countDocuments(query);

		res.json({
			success: true,
			message: "Books retrieved successfully",
			data: books,
			meta: {
				total: totalCount,
				page: currentPage,
				limit: resultLimit,
				totalPages: Math.ceil(totalCount / resultLimit),
			},
		});
	} catch (error) {
		res.status(400).json({
			message: "Validation failed",
			success: false,
			error,
		});
	}
});

// get a single book
booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
	try {
		const id = req.params.bookId;

		// query single book
		const book = await Book.findById(id);

		res.json({
			success: true,
			message: "Book retrieved successfully",
			data: book,
		});
	} catch (error) {
		res.status(400).json({
			message: "Validation failed",
			success: false,
			error,
		});
	}
});

// update a book
booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
	try {
		const id = req.params.bookId;
		const body = req.body;

		// query single book
		const book = await Book.findByIdAndUpdate(id, body, { new: true });

		res.json({
			success: true,
			message: "Book updated successfully",
			data: book,
		});
	} catch (error) {
		res.status(400).json({
			message: "Validation failed",
			success: false,
			error,
		});
	}
});

// delete a book
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
	try {
		const id = req.params.bookId;

		// delete a book
		const book = await Book.findByIdAndDelete(id);

		res.json({
			success: true,
			message: "Book deleted successfully",
			data: book,
		});
	} catch (error) {
		res.status(400).json({
			message: "Validation failed",
			success: false,
			error,
		});
	}
});
