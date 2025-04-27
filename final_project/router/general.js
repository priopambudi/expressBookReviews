const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  if (!req.body) return res.status(400).json({ message: "Body is required" });

  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password is required" });

  users.push({ username, password });

  return res
    .status(200)
    .json({ message: "User registered, now you can login" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });

  myPromise.then((data) => res.status(200).json(data));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      resolve(book);
    }, 1000);
  });

  myPromise
    .then((data) => {
      if (!data) return res.status(404).json({ message: "Book not found" });
      res.status(200).json(data);
    })
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const results = [];

  for (const id in books) {
    if (books[id].author.toLowerCase().includes(author.toLowerCase())) {
      results.push({ id, ...books[id] });
    }
  }

  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(results);
    }, 1000);
  });

  myPromise
    .then((data) => {
      if (data.length <= 0)
        return res.status(400).json({ message: "Book with author not found" });
      return res.status(200).json(data);
    })
    .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const results = [];

  for (const id in books) {
    if (books[id].title.toLowerCase().includes(title.toLowerCase())) {
      results.push({ id, ...books[id] });
    }
  }

  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(results);
    }, 1000);
  });

  myPromise
    .then((data) => {
      if (data.length <= 0)
        return res.status(400).json({ message: "Book with title not found" });
      return res.status(200).json(data);
    })
    .catch((err) => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  let book = books[isbn];
  if (!book) return res.status(403).json({ message: "Book not found" });

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
