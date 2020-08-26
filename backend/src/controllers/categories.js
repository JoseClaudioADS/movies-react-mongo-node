const { getConnection } = require("../config/db");

const db = getConnection();
const categoriesDb = db.get("categories");
const moviesDb = db.get("movies");

class CategoriesController {
  async index(_, res) {
    res.send(await categoriesDb.find({}));
  }

  async store(req, res) {
    const { name } = req.body;
    const newCategory = await categoriesDb.insert({ name });
    res.status(201).json(newCategory);
  }

  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    const category = await categoriesDb.findOne(id);

    if (category) {
      category.name = name;
      await categoriesDb.update(id, { $set: category });
      res.send();
    } else {
      res.sendStatus(404);
    }
  }

  async destroy(req, res) {
    const { id } = req.params;

    const category = await categoriesDb.findOne(id);

    if (category) {
      const moviesByCategory = await moviesDb.count({
        category_id: category._id,
      });

      if (moviesByCategory > 0) {
        res.status(400).json({ error: "There are films with this category" });
      } else {
        await categoriesDb.remove(id);
        res.send();
      }
    } else {
      res.sendStatus(404);
    }
  }
}

module.exports = { CategoriesController };
