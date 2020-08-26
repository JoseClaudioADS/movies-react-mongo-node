const express = require("express");
const cors = require("cors");
const { movieRoutes } = require("./routes/movies");
const { categoriesRoutes } = require("./routes/categories");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/movies", movieRoutes);
app.use("/categories", categoriesRoutes);

app.listen(8080, () => console.log("Server started at port 8080"));
