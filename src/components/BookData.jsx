import axios from "axios";
import { useEffect, useState } from "react";
import "../components/Book.css";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const loader = async () => {
  try {
    const response = await axios.get(
      `https://66742b3a75872d0e0a95614b.mockapi.io/book`
    );
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to fetch books:`, error);
    return null;
  }
};

const BookData = () => {
  const [books, setBooks] = useState([]);
  const [showInputRow, setShowInputRow] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loader();
        if (data) {
          setBooks(data.data);
        }
      } catch (error) {
        console.error(`Failed to fetch data:`, error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      author: "",
      isbn: "",
      publicationdate: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) {
        errors.title = "Title Required";
      }
      if (!values.author) {
        errors.author = "Author Name Required";
      }
      if (!values.isbn) {
        errors.isbn = "ISBN Required";
      }
      if (!values.publicationdate) {
        errors.publicationdate = "Publication Date Required";
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingBookId !== null) {
          await axios.put(
            `https://66742b3a75872d0e0a95614b.mockapi.io/book/${editingBookId}`,
            values
          );
          alert("Book updated successfully!");
        } else {
          await axios.post(
            `https://66742b3a75872d0e0a95614b.mockapi.io/book`,
            values
          );
          alert("Book added successfully!");
        }

        const data = await loader();
        if (data) {
          setBooks(data.data);
        }

        resetForm();
        setShowInputRow(false);
        setEditingBookId(null);
      } catch (error) {
        console.error(`Error occurred:`, error);
        alert("An error occurred. Please try again.");
      }
    },
  });

  const handleAddButtonClick = () => {
    setShowInputRow(true);
    setEditingBookId(null);
    formik.resetForm();
  };

  const handleEditButtonClick = (bookId) => {
    setEditingBookId(bookId);
    setShowInputRow(true);
    const bookToEdit = books.find((book) => book.id === bookId);
    if (bookToEdit) {
      formik.setValues(bookToEdit);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(
        `https://66742b3a75872d0e0a95614b.mockapi.io/book/${bookId}`
      );
      alert("Book deleted successfully!");

      const data = await loader();
      if (data) {
        setBooks(data.data);
      }
    } catch (error) {
      console.error(`Error occurred:`, error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleExitButtonClick = () => {
    formik.resetForm();
    setShowInputRow(false);
    setEditingBookId(null);
  };

  return (
    <div className="BookData">
      <div className="topButtons">
        {!showInputRow && (
          <button className="addBookButton btn" onClick={handleAddButtonClick}>
            <FontAwesomeIcon icon={faPlus} /> Add Book
          </button>
        )}
      </div>

      {showInputRow && (
        <div className="inputRow">
          <input
            placeholder="Title"
            type="text"
            {...formik.getFieldProps("title")}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="error">{formik.errors.title}</div>
          )}

          <input
            placeholder="Author"
            type="text"
            {...formik.getFieldProps("author")}
          />
          {formik.touched.author && formik.errors.author && (
            <div className="error">{formik.errors.author}</div>
          )}

          <input
            placeholder="ISBN No"
            type="text"
            {...formik.getFieldProps("isbn")}
          />
          {formik.touched.isbn && formik.errors.isbn && (
            <div className="error">{formik.errors.isbn}</div>
          )}

          <input
            placeholder="Published date"
            type="text"
            {...formik.getFieldProps("publicationdate")}
          />
          {formik.touched.publicationdate && formik.errors.publicationdate && (
            <div className="error">{formik.errors.publicationdate}</div>
          )}

          <div className="btnContainer">
            <button className="btn" type="button" onClick={formik.handleSubmit}>
              {editingBookId !== null ? "Update" : "Add"}
            </button>
            <button className="btn" type="button" onClick={handleExitButtonClick}>
              Exit
            </button>
          </div>
        </div>
      )}

      <h2>Book Data</h2>

      <table className="bookTable">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN Number</th>
            <th>Publication</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isbn}</td>
              <td>{book.publicationdate}</td>
              <td>
                <button className="actionButton" onClick={() => handleEditButtonClick(book.id)}>
                  <FontAwesomeIcon icon={faPen} /> Edit
                </button>
                <button className="actionButton" onClick={() => handleDelete(book.id)}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookData;
export { loader };
