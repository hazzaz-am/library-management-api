import express, { Application } from "express";
import { booksRoutes } from "./app/controllers/book.controllers";
import { borrowRoutes } from "./app/controllers/borrow.controllers";

export const app: Application = express();
app.use(express.json());
app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (_req, res) => {
	res.json({
		message: "OK",
	});
});
