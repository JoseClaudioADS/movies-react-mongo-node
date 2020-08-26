const express = require("express");
const { MoviesController } = require("../controllers/movies");

const movieRoutes = express.Router();
const moviesController = new MoviesController();

movieRoutes.get("/", moviesController.index);
movieRoutes.post("/", moviesController.store);
movieRoutes.put("/:id", moviesController.update);
movieRoutes.delete("/:id", moviesController.destroy);

module.exports = { movieRoutes };
