const request = require("supertest");
const { response } = require("../app");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Book Routes Test", function () {
    let testBook;
    beforeEach(async function () {
      await db.query("DELETE FROM books");
  
      testBook = await Book.create({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
      });
    });
  
    /** GET /books => { books: [{isbn, amazon_url, ...}]}  */
  
    describe("GET /books", function () {
      test("gets an array of 1 book", async function () {
        let response = await request(app)
          .get("/books");
  
        expect(response.body).toEqual({
            books: [{
                isbn: testBook.isbn,
                amazon_url: testBook.amazon_url,
                author: testBook.author,
                language: testBook.language,
                pages: testBook.pages,
                publisher: testBook.publisher,
                title: testBook.title,
                year: testBook.year
            }]
        });
      });
    });

    /** GET /books/:isbn => { books: [{isbn, amazon_url, ...}]}  */
  
    describe("GET /books/:isbn", function () {
        test("gets 1 book based on the isbn", async function () {
            let response = await request(app)
            .get("/books/0691161518");

            expect(response.body).toEqual({
                book: {
                    isbn: testBook.isbn,
                    amazon_url: testBook.amazon_url,
                    author: testBook.author,
                    language: testBook.language,
                    pages: testBook.pages,
                    publisher: testBook.publisher,
                    title: testBook.title,
                    year: testBook.year
                }
            });
        });
        test("responds with 404", async function () {
            let response = await request(app)
            .get("/books/0");

            expect(response.status).toEqual(404);
        });
    });

    /** POST /books => { book: {isbn, amazon_url, ...}}  */
  
    describe("POST /books", function () {
        test("create 1 book and return that book", async function () {
            const newBook = {
                isbn: "9780765376671",
                amazon_url: "https://us.macmillan.com/books/9780765376671/thewayofkings",
                author: "Brandon Sanderson",
                language: "english",
                pages: 1008,
                publisher: "Tor Books",
                title: "The Way of Kings, Book One of the Stormlight Archive",
                year: 2014
            }
          let response = await request(app)
            .post("/books")
            .send(newBook);
    
          expect(response.body).toEqual({
              book: {
                  isbn: newBook.isbn,
                  amazon_url: newBook.amazon_url,
                  author: newBook.author,
                  language: newBook.language,
                  pages: newBook.pages,
                  publisher: newBook.publisher,
                  title: newBook.title,
                  year: newBook.year
              }
          });
        });

        test("responds with status 400", async function () {
            const newBook = {
                isbn: "9780765376671",
                amazon_url: "https://us.macmillan.com/books/9780765376671/thewayofkings",
            }
          let response = await request(app)
            .post("/books")
            .send(newBook);
    
            expect(response.status).toEqual(400)
            expect(response.body.error).toEqual({
                message: [
                    "instance requires property \"author\"",
                    "instance requires property \"language\"",
                    "instance requires property \"pages\"",
                    "instance requires property \"publisher\"",
                    "instance requires property \"title\"",
                    "instance requires property \"year\"",
                    ],
                    status: 400
          });
        });
      });

      /** PUT /books/:isbn => { book: {isbn, amazon_url, ...}}  */
  
    describe("PUT /books", function () {
        test("update 1 book and return that book", async function () {
            const updatedBook = {
                isbn: "0691161518",
                amazon_url: "https://us.macmillan.com/books/9780765376671/thewayofkings",
                author: "Brandon Sanderson",
                language: "english",
                pages: 1008,
                publisher: "Really Good Publishing Inc.",
                title: "The Way of Kings, Book One of the Stormlight Archive",
                year: 2014
            }
          let response = await request(app)
            .put("/books/0691161518")
            .send(updatedBook);
    
          expect(response.body).toEqual({
              book: {
                  isbn: updatedBook.isbn,
                  amazon_url: updatedBook.amazon_url,
                  author: updatedBook.author,
                  language: updatedBook.language,
                  pages: updatedBook.pages,
                  publisher: updatedBook.publisher,
                  title: updatedBook.title,
                  year: updatedBook.year
              }
          });
        });

        test("responds with status 400", async function () {
            const updatedBook = {
                isbn: "9780765376671",
                amazon_url: "https://us.macmillan.com/books/9780765376671/thewayofkings",
            }
          let response = await request(app)
            .put("/books/0691161518")
            .send(updatedBook);
    
            expect(response.status).toEqual(400)
            expect(response.body.error).toEqual({
                message: [
                    "instance requires property \"author\"",
                    "instance requires property \"language\"",
                    "instance requires property \"pages\"",
                    "instance requires property \"publisher\"",
                    "instance requires property \"title\"",
                    "instance requires property \"year\"",
                    ],
                    status: 400
          });
        });

        test("responds with status 404", async function () {
            const updatedBook = {
                isbn: "0691161518",
                amazon_url: "https://us.macmillan.com/books/9780765376671/thewayofkings",
                author: "Brandon Sanderson",
                language: "english",
                pages: 1008,
                publisher: "Really Good Publishing Inc.",
                title: "The Way of Kings, Book One of the Stormlight Archive",
                year: 2014
            }
          let response = await request(app)
            .put("/books/0")
            .send(updatedBook)

            expect(response.status).toEqual(404)
        });
      });

    /** GET /books/:isbn => { books: [{isbn, amazon_url, ...}]}  */
  
    describe("DELETE /books/:isbn", function () {
        test("delete 1 book based on the isbn", async function () {
            await request(app).delete("/books/0691161518");
            const response = await request(app).get("/books");
            expect(response.body).toEqual({books: []});
        });
        test("responds with 404", async function () {
            let response = await request(app)
            .delete("/books/0");

            expect(response.status).toEqual(404);
        });
    });
})
  
afterAll(async function () {
    await db.end();
})