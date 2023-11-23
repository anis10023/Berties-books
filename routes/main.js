// Exporting a function that sets up routes for the application
module.exports = function (app, shopData) {
  // Home route
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });

  // About route
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  // Search route
  app.get("/search", function (req, res) {
    // Extract the search query from the URL
    const searchQuery = req.query.query;

    if (!searchQuery) {
      // If no search query is provided, render the search form
      return res.render("search.ejs", { shopName: "Bertie's Book" });
    }

    // Perform a database query to find books matching the search query
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchPattern = `%${searchQuery}%`;

    db.query(sqlquery, [searchPattern], (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).send("Error fetching data from the database.");
      }

      // Render the search results page with the matching books
      res.render("search-result.ejs", {
        shopName: "Bertie's Book",
        availableBooks: result,
      });
    });
  });

  // Register route
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  // Registered route
  app.post("/registered", function (req, res) {
    res.send(
      " Hello " +
        req.body.first +
        " " +
        req.body.last +
        " you are now registered!  We will send an email to you at " +
        req.body.email
    );
  });

  // List route
  app.get("/list", function (req, res) {
    // Query database to get all the books
    let sqlquery = "SELECT * FROM books";

    // Execute SQL query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  // Addbook route
  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  // Bookadded route
  app.post("/bookadded", function (req, res) {
    // Saving data in the database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";

    // Execute SQL query
    let newrecord = [req.body.name, req.body.price];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        res.send(
          " This book is added to database, book name: " +
            req.body.name +
            " price " +
            req.body.price
        );
      }
    });
  });

  // Bargainbooks route
  app.get("/bargainbooks", function (req, res) {
    // Query database to get all the books with price less than 20
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    // Execute SQL query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("bargainbooks.ejs", newData);
    });
  });
};
