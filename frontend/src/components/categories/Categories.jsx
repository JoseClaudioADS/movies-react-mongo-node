import React, { useState, useEffect } from "react";
import Joi from "joi";
import api from "../../services/api";

import InputError from "../common/inputerror/InputError";

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
});

const Categories = () => {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const d = await api.get("/categories");
      setCategories(d.data);
    }
    loadCategories();
  }, []);

  async function handleSubmit() {
    try {
      await schema.validateAsync({ name });
      const newCategory = await api.post("/categories", { name });
      setCategories([...categories, newCategory.data]);
      setName("");
      setErrors([]);
    } catch (schemaError) {
      setErrors(schemaError.details);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  return (
    <div className="container">
      <h1>Categories</h1>
      <hr></hr>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={name}
            className="form-control"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <InputError fieldKey="name" details={errors}></InputError>
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
      <br></br>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => {
            return (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
