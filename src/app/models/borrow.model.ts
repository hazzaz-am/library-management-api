import { model, Schema } from "mongoose";
import { BorrowStaticMethod, IBorrow } from "../interfaces/borrow.interface";
import { Book } from "./book.model";

const borrowSchema = new Schema<IBorrow, BorrowStaticMethod>(
	{
		book: {
			type: Schema.Types.ObjectId,
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
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

// instance methods
borrowSchema.static("updateAvailability", async function (bookId: string) {
	const book = await Book.findById(bookId);

	if (book && book.copies === 0 && book.available) {
		await Book.findByIdAndUpdate(bookId, { available: false });
	}
});

// hooks middleware
borrowSchema.pre("save", async function (next) {
	const book = await Book.findById(this.book);

	if (!book) {
		return next(new Error("Book not found"));
	}

	if (book.copies < this.quantity) {
		return next(new Error("Not enough copies available"));
	}

	next();
});

borrowSchema.post("save", async function (doc, next) {
	await Book.updateOne({ _id: doc.book }, { $inc: { copies: -doc.quantity } });
	Borrow.updateAvailability(doc.book);

	next();
});

export const Borrow = model<IBorrow, BorrowStaticMethod>(
	"Borrow",
	borrowSchema
);
