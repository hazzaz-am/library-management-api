import express, { Request, Response } from "express";
import { ZBorrow } from "../zodSchema/borrow.zod";
import { Borrow } from "../models/borrow.model";

export const borrowRoutes = express.Router();

// create a book
borrowRoutes.post("/", async (req: Request, res: Response) => {
	try {
		const body = await ZBorrow.parseAsync(req.body);
		const borrow = new Borrow(body);
		const borrowedBook = await borrow.save();

		res.json({
			success: true,
			message: "Book borrowed successfully",
			data: borrowedBook,
		});
	} catch (error: any) {
		res.status(400).json({
			message: "Validation failed",
			success: false,
			error: Object.keys(error).length === 0 ? "Couldn't borrow a book" : error,
		});
	}
});

// get borrowed books
borrowRoutes.get("/", async (req: Request, res: Response) => {
	try {
		const books = await Borrow.aggregate([
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
	} catch (error) {
		res.status(400).json({
			message: "Validation failed",
			success: false,
			error,
		});
	}
});
