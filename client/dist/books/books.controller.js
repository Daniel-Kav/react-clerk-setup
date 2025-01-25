"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.listBooks = void 0;
const books_services_1 = require("./books.services");
const listBooks = async (c) => {
    try {
        // Limit the number of books to be returned
        const limit = Number(c.req.query('limit'));
        const data = await (0, books_services_1.booksService)(limit);
        if (data == null || data.length == 0) {
            return c.text("Books not found", 404);
        }
        return c.json(data, 200);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.listBooks = listBooks;
const getBook = async (c) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id))
        return c.text("Invalid ID", 400);
    const book = await (0, books_services_1.getBookService)(id);
    if (book == undefined) {
        return c.text("Book not found", 404);
    }
    return c.json(book, 200);
};
exports.getBook = getBook;
const createBook = async (c) => {
    try {
        const book = await c.req.json();
        const createdBook = await (0, books_services_1.createBookService)(book);
        if (!createdBook)
            return c.text("Book not created", 404);
        return c.json({ msg: "Book created successfully" }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.createBook = createBook;
const updateBook = async (c) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id))
        return c.text("Invalid ID", 400);
    const book = await c.req.json();
    try {
        // Search for the book
        const searchedBook = await (0, books_services_1.getBookService)(id);
        if (searchedBook == undefined)
            return c.text("Book not found", 404);
        // Update the book data
        const res = await (0, books_services_1.updateBookService)(id, book);
        // Return a success message
        if (!res)
            return c.text("Book not updated", 404);
        return c.json({ msg: "Book updated successfully" }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.updateBook = updateBook;
const deleteBook = async (c) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id))
        return c.text("Invalid ID", 400);
    try {
        // Search for the book
        const book = await (0, books_services_1.getBookService)(id);
        if (book == undefined)
            return c.text("Book not found", 404);
        // Delete the book
        const res = await (0, books_services_1.deleteBookService)(id);
        if (!res)
            return c.text("Book not deleted", 404);
        return c.json({ msg: "Book deleted successfully" }, 201);
    }
    catch (error) {
        return c.json({ error: error?.message }, 400);
    }
};
exports.deleteBook = deleteBook;
