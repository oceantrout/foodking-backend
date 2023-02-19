require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const { router: AuthRouter } = require("./auth-router");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const morgan = require("morgan");

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", AuthRouter);

app.get("/", (req, res) => {
  res.send("Weclcome to the root directory");
});

// Get all Restaurants
app.get("/restaurants", async (req, res) => {
  try {
    //const results = await db.query("select * from restaurants");
    const restaurantRatingsData = await db.query(
      "select * from restaurants left join( select restaurant_id, count(*), TRUNC(AVG(rating)) as average_rating from reviews group by restaurant_id) as rating on restaurants.restaurant_id = rating.restaurant_id"
    );

    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Get a Restaurant
app.get("/restaurants/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const restaurant = await db.query(
      "select * from restaurants left join( select restaurant_id, count(*), TRUNC(AVG(rating)) as average_rating from reviews group by restaurant_id) as rating on restaurants.restaurant_id = rating.restaurant_id where restaurants.restaurant_id= $1",
      [req.params.id]
    );
    // select * from restaurants wehre id = req.params.id

    const reviews = await db.query(
      "select * from reviews where restaurant_id = $1",
      [req.params.id]
    );
    console.log(reviews);

    res.status(200).json({
      status: "succes",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a Restaurant

app.post("/restaurants", async (req, res) => {
  console.log(req.body);

  try {
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3, $4) returning *",
      [
        req.body.name,
        req.body.location,
        req.body.price_range,
        req.body.resaurant_id,
      ]
    );
    console.log(results);
    res.status(201).json({
      status: "succes",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update Restaurants

app.put("/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3, address = $4, image_url=$5, type_of_food=$6 where restaurant_id = $7 returning *",
      [
        req.body.name,
        req.body.location,
        req.body.price_range,
        req.body.address,
        req.body.image_url,
        req.body.type_of_food,
        req.params.id,
      ]
    );

    res.status(200).json({
      status: "succes",
      data: {
        retaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(req.params.id);
  console.log(req.body);
});

// Delete Restaurant

app.delete("/restaurants/:id", async (req, res) => {
  try {
    const results = db.query(
      "DELETE FROM restaurants where restaurant_id = $1",
      [req.params.id]
    );
    res.status(204).json({
      status: "sucess",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    console.log(newReview);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
