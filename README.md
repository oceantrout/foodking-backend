#Project Foodking

Back-end technology used: PostgresSQL, Express, Node.JS
Services: Authentication, Database, API

1. back-end service endpoint

get: "/restaurnts" - to get full list of restaurants
post : "/restaurants" - create a restaurant
get: "/restaurants/:id" - get a particular restaurant with the id
put: "/restaurants/:id" - to update a particular restaurant with the id
delete: "/restaurants/:id" - to delete one paticular restaurant with the id
post: "/restaurants/:id/addReview" - to post review to selected retaurant with the id

Authentication

post("/auth/signup", signUp) - to sign up
post("/auth/signin", signIn) - to sign in
post("/auth/signout", signOut) - to sign out

2. Data model
   Two tables
   Restaurants 7 columns: restaurant_id, name, address, image_url, type_of_food, price_range, location
   Reviews 5 columns: id, restaurant_id, name, review, rating

3. SQL and end point
   Get a Restaurant
   "select _ from restaurants left join( select restaurant_id, count(_), TRUNC(AVG(rating)) as average_rating from reviews group by restaurant_id) as rating on restaurants.restaurant_id = rating.restaurant_id where restaurants.restaurant_id= $1",
   [req.params.id]
   );
   Get Reviews from restaurants
   const reviews = await db.query(
   "select \* from reviews where restaurant_id = $1",
   [req.params.id]
   );
