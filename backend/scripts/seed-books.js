const { pool } = require("../src/db");

const books = [
  {
    title: "The Hobbit",
    authors: "J. R. R. Tolkien",
    category: "Fantasy",
    price: 12.99,
    bookDate: "1937-09-21",
    keywords: "Middle-earth; adventure; fantasy",
    notes: "A classic fantasy novel.",
    recommendation: 10,
    description: "Bilbo Baggins leaves his quiet life and joins an unexpected journey through Middle-earth.",
  },
  {
    title: "The Lord of the Rings",
    authors: "J. R. R. Tolkien",
    category: "Fantasy",
    price: 24.99,
    bookDate: "1954-07-29",
    keywords: "Middle-earth; quest; fantasy",
    notes: "A classic fantasy trilogy.",
    recommendation: 10,
    description: "A fellowship travels across Middle-earth to destroy a powerful ring.",
  },
  {
    title: "O Velho que Lia Romances de Amor",
    authors: "Luís Sepúlveda",
    category: "Fiction",
    price: 10.99,
    bookDate: "1989-01-01",
    keywords: "Amazon; nature; fiction",
    notes: "A novel about nature and solitude.",
    recommendation: 9,
    description: "An old man living in the Amazon reflects on love, memory, and the natural world.",
  },
  {
    title: "História de uma Gaivota e do Gato que a Ensinou a Voar",
    authors: "Luís Sepúlveda",
    category: "Children's literature",
    price: 9.99,
    bookDate: "1996-01-01",
    keywords: "friendship; animals; children",
    notes: "A story about responsibility and friendship.",
    recommendation: 9,
    description: "A cat makes a promise to a dying seagull and learns about care, friendship, and flight.",
  },
  {
    title: "War and Peace",
    authors: "Tolstoi",
    category: "Classic",
    price: 19.99,
    bookDate: "1869-01-01",
    keywords: "Russia; history; classic",
    notes: "A major work of Russian literature.",
    recommendation: 10,
    description: "Several families experience love, war, and social change during the Napoleonic era.",
  },
  {
    title: "Anna Karenina",
    authors: "Tolstoi",
    category: "Classic",
    price: 17.99,
    bookDate: "1878-01-01",
    keywords: "Russia; society; classic",
    notes: "A major work of Russian literature.",
    recommendation: 10,
    description: "A novel about love, family, society, and the consequences of personal choices.",
  },
];

async function seedBooks() {
  let inserted = 0;

  for (const book of books) {
    const result = await pool.query(
      `INSERT INTO books (
         title, authors, category, price, book_date, keywords, notes, recomendation, description
       )
       SELECT $1::varchar(128), $2::varchar(256), $3::varchar(128), $4::numeric,
              $5::date, $6::varchar(256), $7::varchar(256), $8::integer, $9::varchar(1024)
       WHERE NOT EXISTS (
         SELECT 1 FROM books
         WHERE title = $1::varchar(128) AND authors = $2::varchar(256)
       )`,
      [
        book.title,
        book.authors,
        book.category,
        book.price,
        book.bookDate,
        book.keywords,
        book.notes,
        book.recommendation,
        book.description,
      ]
    );

    inserted += result.rowCount;
  }

  console.log(`Seeded ${inserted} book${inserted === 1 ? "" : "s"}`);
}

seedBooks()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
