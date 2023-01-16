const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = req.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  } else {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;

    if ( pageCount === readPage ) {
      finished = true;
    }

    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getAllBooksHandler = (req, h) => {
  const {name, reading, finished} = req.query;

  if (name !== undefined) {
    const nameQuery = name.toLowerCase();
    const book = books.filter((n) => n.name.toString().toLowerCase().indexOf(nameQuery) >= 0);

    if (book.length > 0) {
      const response = h.response({
        status: 'success',
        data: {
          book: book.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
      return response;
    }
  }

  if (reading !== undefined) {
    if (reading === 0) {
      const newReading = false;
      const book = books.filter((n) => n.reading === newReading);

      if (book.length > 0) {
        const response = h.response({
          status: 'success',
          data: {
            book: book.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }

    if (reading === 1) {
      const newReading = true;
      const book = books.filter((n) => n.reading === newReading);

      if (book.length > 0) {
        const response = h.response({
          status: 'success',
          data: {
            book: book.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }
  }

  if (finished !== undefined) {
    if (finished === 0) {
      const newFinished = false;
      const book = books.filter((n) => n.finished === newFinished);

      if (book.length > 0) {
        const response = h.response({
          status: 'success',
          data: {
            book: book.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }

    if (finished === 1) {
      const newFinished = true;
      const book = books.filter((n) => n.finished === newFinished);

      if (book.length > 0) {
        const response = h.response({
          status: 'success',
          data: {
            book: book.map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
          },
        });
        response.code(200);
        return response;
      }
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (req, h) => {
  const {id} = req.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookByIdHandler = (req, h) => {
  const {id} = req.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading} = req.payload;
  const updatedAt = new Date().toISOString();

  const bookIndex = books.findIndex((n) => n.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookById = (req, h) => {
  const {id} = req.params;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(bookIndex, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookById,
};
