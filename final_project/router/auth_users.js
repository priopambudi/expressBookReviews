const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  const checkUser = users.filter((user) => user.username == username);

  if (checkUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const checkUser = users.filter(
    (user) => user.username == username && user.password == password
  );

  if (checkUser.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and Password is required" });

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "secret", { expiresIn: 60 * 60 });
    req.session.authorization = {
      token,
      username,
    };
    return res.status(200).send({ message: "User successfully logged in" });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;
  const { comment } = req.body;
  const book = books[isbn];
  if (!book) return res.status(403).json({ message: "Book not found" });

  book.reviews[username] = {
    comment,
  };

  return res.status(300).json(book);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;

  const book = books[isbn];
  if (!book) return res.status(403).json({ message: "Book not found" });

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
