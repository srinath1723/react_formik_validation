import axios from "axios";
import { useEffect, useState } from "react";
import "../components/Author.css";
import { useFormik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const loader = async () => {
  try {
    const response = await axios.get(
      `https://66742b3a75872d0e0a95614b.mockapi.io/author`
    );
    return { data: response.data };
  } catch (error) {
    console.error(`Failed to fetch authors:`, error);
    return null;
  }
};

const AuthorsData = () => {
  const [authors, setAuthors] = useState([]);
  const [showInputRow, setShowInputRow] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loader();
        if (data) {
          setAuthors(data.data);
        }
      } catch (error) {
        console.error(`Failed to fetch data:`, error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      birthdate: "",
      biography: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Name Required";
      }
      if (!values.birthdate) {
        errors.dob = "DOB Required";
      }
      if (!values.biography) {
        errors.biography = "Biography Required";
      }
      return errors;
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingAuthorId !== null) {
          await axios.put(
            `https://66742b3a75872d0e0a95614b.mockapi.io/author/${editingAuthorId}`,
            values
          );
          alert("Author updated successfully!");
        } else {
          await axios.post(
            `https://66742b3a75872d0e0a95614b.mockapi.io/author`,
            values
          );
          alert("Author added successfully!");
        }

        const data = await loader();
        if (data) {
          setAuthors(data.data);
        }

        resetForm();
        setShowInputRow(false);
        setEditingAuthorId(null);
      } catch (error) {
        console.error(`Error occurred:`, error);
        alert("An error occurred. Please try again.");
      }
    },
  });

  const handleAddButtonClick = () => {
    setShowInputRow(true);
    setEditingAuthorId(null);
    formik.resetForm();
  };

  const handleEditButtonClick = (authorId) => {
    setEditingAuthorId(authorId);
    setShowInputRow(true);
    const authorToEdit = authors.find((author) => author.id === authorId);
    if (authorToEdit) {
      formik.setValues(authorToEdit);
    }
  };

  const handleDelete = async (authorId) => {
    try {
      await axios.delete(
        `https://66742b3a75872d0e0a95614b.mockapi.io/author/${authorId}`
      );
      alert("Author deleted successfully!");

      const data = await loader();
      if (data) {
        setAuthors(data.data);
      }
    } catch (error) {
      console.error(`Error occurred:`, error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleExitButtonClick = () => {
    formik.resetForm();
    setShowInputRow(false);
    setEditingAuthorId(null);
  };

  return (
    <div className="AuthorsData">
      <div className="topButtons">
        {!showInputRow && (
          <button className="addAuthorButton btn" onClick={handleAddButtonClick}>
            <FontAwesomeIcon icon={faPlus} /> Add Author
          </button>
        )}
      </div>

      {showInputRow && (
        <div className="inputRow">
          <input
            placeholder="Name"
            type="text"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}

          <input
            placeholder="Date of Birth"
            type="text"
            {...formik.getFieldProps("birthdate")}
          />
          {formik.touched.dob && formik.errors.dob && (
            <div className="error">{formik.errors.dob}</div>
          )}

          <input
            placeholder="Biography"
            type="text"
            {...formik.getFieldProps("biography")}
          />
          {formik.touched.biography && formik.errors.biography && (
            <div className="error">{formik.errors.biography}</div>
          )}

          <div className="btnContainer">
            <button className="btn" type="button" onClick={formik.handleSubmit}>
              {editingAuthorId !== null ? "Update" : "Add"}
            </button>
            <button className="btn" type="button" onClick={handleExitButtonClick}>
              Exit
            </button>
          </div>
        </div>
      )}

      <h2>Author Data</h2>

      <table className="authorTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Biography</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.birthdate}</td>
              <td>{author.biography}</td>
              <td>
                <button className="actionButton" onClick={() => handleEditButtonClick(author.id)}>
                  <FontAwesomeIcon icon={faPen} /> Edit
                </button>
                <button className="actionButton" onClick={() => handleDelete(author.id)}>
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

export default AuthorsData;
export { loader };
