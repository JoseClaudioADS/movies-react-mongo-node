import React, { useState, useEffect } from "react";
import Joi from "joi";
import api from "../../services/api";

import InputError from "../common/inputerror/InputError";

const schema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(3).max(100).required(),
  category_id: Joi.string()
    .required()
    .messages({ "string.empty": "Category is required" }),
}).messages({ "string.empty": "This field is required" });

const Movies = () => {
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [movieId, setMovieId] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const response = await api.get("/categories");
      setCategories(response.data);
    }

    async function loadMovies() {
      const response = await api.get("/movies");
      setMovies(response.data);
    }
    loadCategories();
    loadMovies();
  }, []);

  async function handleSubmit() {
    try {
      const movie = {
        title,
        description,
        category_id: categoryId,
      };
      await schema.validateAsync(movie, { abortEarly: false });
      let response = null;
      if (movieId) {
        response = await api.put(`/movies/${movieId}`, movie);
      } else {
        response = await api.post("/movies", movie);
      }
      const newMovie = response.data;
      newMovie.category = categories.filter((c) => c._id === categoryId);
      configureMovies(newMovie);
      resetForm();
    } catch (schemaError) {
      setErrors(schemaError.details);
    }
  }

  function configureMovies(newMovie) {
    let newMovies = movies;
    if (movieId) {
      newMovies = newMovies.filter((m) => m._id !== newMovie._id);
    }
    setMovies([...newMovies, newMovie]);
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setMovieId("");
    setErrors([]);
  }

  async function handleDelete(id) {
    await api.delete(`/movies/${id}`);
    setMovies(movies.filter((c) => c._id !== id));
    resetForm();
  }

  async function handleEdit(movie) {
    setTitle(movie.title);
    setDescription(movie.description);
    setCategoryId(movie.category_id);
    setMovieId(movie._id);
  }

  return (
    <div className="container">
      <h1>Movies</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="form-control"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <InputError fieldKey="title" details={errors}></InputError>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            className="form-control"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
          <InputError fieldKey="description" details={errors}></InputError>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={categoryId}
            className="form-control"
            onChange={(event) => {
              setCategoryId(event.target.value);
            }}
          >
            <option value={null}>Choose one</option>
            {categories.map((c) => {
              return (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              );
            })}
          </select>
          <InputError fieldKey="category_id" details={errors}></InputError>
        </div>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
      <br></br>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((row) => (
            <tr key={row._id}>
              <td>{row.title}</td>
              <td align="left">{row.description}</td>
              <td align="left">{row.category[0].name}</td>
              <td align="left">
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-info"
                    onClick={() => handleEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(row._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movies;
