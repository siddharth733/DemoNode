const mysql = require("mysql");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const cors = require("cors");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "Demo",
  connectionLimit: 10,
});

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("", (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`connected as ${conn.threadId}`);

    conn.query(`select * from Detail`, (err, result) => {
      conn.release();
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
});

app.get("/data/:id", (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`connected as ${conn.threadId}`);

    conn.query(
      `select * from Detail where id = ?`,
      [req.params.id],
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
});

app.post("/add", (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`connected as ${conn.threadId}`);

    const params = req.body;

    conn.query(`insert into Detail set ?`, params, (err, result) => {
      conn.release();
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
});

app.put("/update/:id", (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`connected as ${conn.threadId}`);

    const { name, email } = req.body;

    conn.query(
      `update Detail set name = ?, email = ? where id = ?`,
      [name, email, req.params.id],
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
});

app.delete("/delete/:id", (req, res) => {
  pool.getConnection((err, conn) => {
    if (err) throw err;
    console.log(`connected as ${conn.threadId}`);

    conn.query(
      `delete from Detail where id = ?`,
      [req.params.id],
      (err, result) => {
        conn.release();
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  });
});

app.listen(port, () => console.log("Working.... Port 5000 "));
