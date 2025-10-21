// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-system';

mongoose.connect(MONGODB_URI);

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    genre: "Fiction",
    year: 1925,
    copies: 5,
    totalCopies: 5,
    description: "A classic novel about the American Dream.",
    cover: "https://i.pinimg.com/736x/47/a1/8b/47a18b71aee1940a9c7f1a1b5eb8fa95.jpg"
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780446310789",
    genre: "Fiction",
    year: 1960,
    copies: 3,
    totalCopies: 3,
    description: "A story about racial injustice in the South.",
    cover: "https://i.pinimg.com/736x/c1/ba/cf/c1bacfb8bbc9a8fdf87af6b24f6fb1bb.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: "Dystopian",
    year: 1949,
    copies: 4,
    totalCopies: 4,
    description: "A dystopian novel about totalitarianism.",
    cover: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSMg8ZN--req9rvQs53rhRoM0bTDJJgw231rfNO37c3IYH9-A2xqQfPl_sUruvLW5cC6sIf0I4DXr5q9VEklieBKTlE_AJd7BKBU2hePTkDUeeCErcot767YitahshVasVK2a6M5w&usqp=CAc"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    genre: "Romance",
    year: 1813,
    copies: 2,
    totalCopies: 2,
    description: "A romantic novel about love and class.",
    cover: "https://m.media-amazon.com/images/I/91bckGWvmlL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769488",
    genre: "Fiction",
    year: 1951,
    copies: 6,
    totalCopies: 6,
    description: "A coming-of-age story.",
    cover: "https://i.pinimg.com/1200x/73/3c/2b/733c2b6f4bb5ea4783ca89e068688e91.jpg"
  }
];

const seedDB = async () => {
  try {
    await Book.deleteMany({});
    console.log('Cleared existing books.');
    await Book.insertMany(sampleBooks);
    console.log('Sample books inserted successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
