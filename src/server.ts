import mongoose from "mongoose";
import { Server } from "http";
import { app } from "./app";

let server: Server;
const PORT = 8000;

async function main() {
	try {
		await mongoose.connect(
			"mongodb+srv://library_management_admin:rZp7zFbejjvMtMBd@cluster0.vtacaoy.mongodb.net/library-management?retryWrites=true&w=majority&appName=Cluster0"
		);
		console.log("Database Connected");
		server = app.listen(PORT, () => {
			console.log(`Server is running on PORT: ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
}

main();
