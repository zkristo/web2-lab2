const { Pool } = require("pg");
const express = require("express");
const app = express();
var path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5433,
  password: "bazepodataka",
  database: "postgres",
});

pool.connect();

data = {};
checked = "";
app.get("/", (req, res) => {
  res.render("home", {
    req: req,
    data: data,
    checked: checked,
  });
});

app.post("/auth", (req, res) => {
  checked = "enable" in req.body ? "checked" : "";
  if ("enable" in req.body) {
    if (!/^\d+$/.test(req.body.id)) {
      console.log("INVALID INPUT");
      data = [{ Argument: "invalid" }];
      res.redirect("/");
    } else {
      console.log("GOOD input");
      pool.query(
        "SELECT * FROM users WHERE id = $1",
        [req.body.id],
        (err, result) => {
          if (!err) {
            data = result.rows;
            console.log(data);
            res.redirect("/");
          } else {
            console.log(err.stack);
            res.redirect("/");
          }
        }
      );
    }
  } else {
    pool.query(
      "SELECT * FROM users WHERE id = '" + req.body.id + "'",
      (err, result) => {
        if (!err) {
          data = result.rows;
          console.log(data);
          res.redirect("/");
        } else {
          console.log(err.stack);
          res.redirect("/");
        }
      }
    );
  }
});

app.listen(3000);
