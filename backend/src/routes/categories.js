const express = require("express");
const { CategoriesController } = require("../controllers/categories");

const categoriesRoutes = express.Router();
const categoriesController = new CategoriesController();

categoriesRoutes.get("/", categoriesController.index);
categoriesRoutes.post("/", categoriesController.store);
categoriesRoutes.put("/:id", categoriesController.update);
categoriesRoutes.delete("/:id", categoriesController.destroy);

module.exports = { categoriesRoutes };
