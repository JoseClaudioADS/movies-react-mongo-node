const monk = require("monk");
const { getConnection } = require("../config/db");

const db = getConnection();
const moviesDb = db.get("movies");
const categoriesDb = db.get("categories");

class MoviesController {
  async index(_, res) {
    const movies = await moviesDb.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $match: { category: { $ne: [] } } },
    ]);

    res.send(movies);
  }

  async store(req, res) {
    const { title, description, category_id } = req.body;
    const newMovie = await moviesDb.insert({
      title,
      description,
      category_id: monk.id(category_id),
    });
    res.status(201).json(newMovie);
  }

  async update(req, res) {
    const { id } = req.params;

    const movie = await moviesDb.findOne(id);

    if (movie) {
      Object.assign(movie, req.body);
      await moviesDb.update(id, { $set: movie });
      res.json(movie);
    } else {
      res.sendStatus(404);
    }
  }

  async destroy(req, res) {
    const { id } = req.params;
    const movie = await moviesDb.findOne(id);

    if (movie) {
      await moviesDb.remove(id);
      res.send();
    } else {
      res.sendStatus(404);
    }
  }
}

module.exports = { MoviesController };
