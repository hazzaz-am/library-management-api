# 📚 Library Management API

A simple RESTful API to manage library using Node.js, Express, and MongoDB. It supports book tracking, borrowing with features like availability control, quantity validation, and borrowing summaries.

---

## 🚀 Features

- 📖 Add and list books with availability and copies
- ✅ Borrow books with quantity and due date validation
- ↻ Automatically update book stock and availability
- 📊 Get summaries of borrowed books (total quantity, titles)
- ❌ Prevent borrowing if not enough stock

---

## 💠 Technologies Used

- **Express.js**
- **MongoDB**
- **TypeScript**
- **Zod** and **Mongoose** for request and schema validation
- **Mongoose Hooks** and **Static Methods**

---

## 📦 Project Structure

```
/src
/app
 ├ /models
 ├ /controllers
 ├ /interfaces
 ├ /zodSchema
├ app.ts
└ server.ts
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/hazzaz-am/library-management-api.git
cd book-borrow-api
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run the app

#### In development:

```bash
pnpm dev
```

#### In production:

```bash
pnpm build
pnpm start
```

---

## 📡 API Endpoints

### 📁 Collection: Books

### ✅ `GET /api/books`

Fetch all books with optional filters and sorting.

#### Query Parameters:

| Param    | Type   | Description                           |
| -------- | ------ | ------------------------------------- |
| `filter` | string | Filter by genre                       |
| `sortBy` | string | Field to sort by (e.g. createdAt)     |
| `sort`   | string | `asc` or `desc`                       |
| `limit`  | number | Limit number of results (default: 10) |

#### Example:

```
GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=10
```

---

### ➕ `POST /api/books`

Create a new book.

#### Fields:

- title (string) — Required. The book’s title.
- author (string) — Required. The book’s author.
- genre (string) — Required. Must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY.
- isbn (string) — Required and unique. The book’s International Standard Book Number.
- description (string) — Optional. A brief summary or description of the book.
- copies (number) — Required. Non-negative integer representing total copies available.
- available (boolean) — Defaults to true. Indicates if the book is currently available for borrowing.

#### Request Body

```json
{
	"title": "The Theory of Everything",
	"author": "Stephen Hawking",
	"genre": "SCIENCE",
	"isbn": "9780553380163",
	"description": "An overview of cosmology and black holes.",
	"copies": 5,
	"available": true
}
```

#### Response:

```json
{
	"success": true,
	"message": "Book created successfully",
	"data": {
		"_id": "64f123abc4567890def12345",
		"title": "The Theory of Everything",
		"author": "Stephen Hawking",
		"genre": "SCIENCE",
		"isbn": "9780553380163",
		"description": "An overview of cosmology and black holes.",
		"copies": 5,
		"available": true,
		"createdAt": "2024-11-19T10:23:45.123Z",
		"updatedAt": "2024-11-19T10:23:45.123Z"
	}
}
```

---

### 📅 `GET /api/books/:bookId`

Retrieve a book by ID.

#### Params

> ```
> :bookId
> ```

#### Response:

```json
{
	"success": true,
	"message": "Book retrieved successfully",
	"data": {
		"_id": "64f123abc4567890def12345",
		"title": "The Theory of Everything",
		"author": "Stephen Hawking",
		"genre": "SCIENCE",
		"isbn": "9780553380163",
		"description": "An overview of cosmology and black holes.",
		"copies": 5,
		"available": true,
		"createdAt": "2024-11-19T10:23:45.123Z",
		"updatedAt": "2024-11-19T10:23:45.123Z"
	}
}
```

---

### ✏️ `PUT /api/books/:bookId`

Update a book by ID.

#### Params

> ```
> :bookId
> ```

#### Request Body:

```json
{
	"title": "Updated Title"
}
```

#### Response:

```json
{
	"success": true,
	"message": "Book updated successfully",
	"data": {
		"_id": "64f123abc4567890def12345",
		"title": "The Theory of Everything",
		"author": "Stephen Hawking",
		"genre": "SCIENCE",
		"isbn": "9780553380163",
		"description": "An overview of cosmology and black holes.",
		"copies": 50,
		"available": true,
		"createdAt": "2024-11-19T10:23:45.123Z",
		"updatedAt": "2024-11-20T08:30:00.000Z"
	}
}
```

---

### ❌ `DELETE /api/books/:bookId`

Delete a book by ID.

#### Params

> ```
> :bookId
> ```

#### Response:

```json
{
	"success": true,
	"message": "Book deleted successfully",
	"data": null
}
```

---

### 📁 Collection: Borrows

### 📅 `POST /api/borrow`

Borrow a book.

#### Validation:

- Before request validates book exists and has enough copies
- After request decreases stock
- Sets availability to `false` in `Book` if copies become 0

#### Request Body:

```json
{
	"book": "64ab3f9e2a4b5c6d7e8f9012",
	"quantity": 2,
	"dueDate": "2025-07-18T00:00:00.000Z"
}
```

#### Response:

```json
{
	"success": true,
	"message": "Book borrowed successfully",
	"data": {
		"_id": "64bc4a0f9e1c2d3f4b5a6789",
		"book": "64ab3f9e2a4b5c6d7e8f9012",
		"quantity": 2,
		"dueDate": "2025-07-18T00:00:00.000Z",
		"createdAt": "2025-06-18T07:12:15.123Z",
		"updatedAt": "2025-06-18T07:12:15.123Z"
	}
}
```

---

### 📊 `GET /api/borrow`

Returns total quantity borrowed per book.

#### Aggregation:

- Group borrow records by book
- Sum total quantity borrowed per book and save as `totalQuantity`
- Return book info and total borrowed quantity

#### Response:

```json
{
	"success": true,
	"message": "Borrowed books summary retrieved successfully",
	"data": [
		{
			"book": {
				"title": "The Theory of Everything",
				"isbn": "9780553380163"
			},
			"totalQuantity": 5
		},
		{
			"book": {
				"title": "1984",
				"isbn": "9780451524935"
			},
			"totalQuantity": 3
		}
	]
}
```

---

---

## 👨‍💻 About Me

Hi, I'm Hazzaz Abdul Mannan — a passionate software developer specializing in full-stack development. I enjoy building practical web applications that solve real-world problems.
