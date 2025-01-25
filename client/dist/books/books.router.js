"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const validators_1 = require("../validators"); // Assuming you have a bookSchema defined for validation
const books_controller_1 = require("./books.controller");
exports.bookRouter = new hono_1.Hono();
// GET all books - /api/books
exports.bookRouter.get("/books", books_controller_1.listBooks);
// GET a single book by ID - /api/books/:id
exports.bookRouter.get("/books/:id", books_controller_1.getBook);
// POST create a new book - /api/books
exports.bookRouter.post("/books", (0, zod_validator_1.zValidator)('json', validators_1.bookSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), books_controller_1.createBook);
// PUT update a book by ID - /api/books/:id
exports.bookRouter.put("/books/:id", books_controller_1.updateBook);
// DELETE a book by ID - /api/books/:id
exports.bookRouter.delete("/books/:id", books_controller_1.deleteBook);
