const http = require("http");
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
var secret_key = "mofutsal";

// Koneksi
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mofutsal",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    return res.status(200).json({});
  }
  next();
});

app.post("/user/login", (req, res) => {
  const { username, password } = req.body;

  conn.query(
    `SELECT * FROM user WHERE username='${username}' AND password='${password}'`,
    (err, rows) => {
      if (err) {
        res.status(500).json(res.status);
      } else {
        if (rows.length > 0) {
          res.status(200).json({ status: 200, id_user: rows[0].id_user });
        } else {
          res.status(400).json({ status: 400 });
        }
      }
    }
  );
});

app.post("/user/register", (req, res) => {
  const { nama, alamat, username, password, phone, ktp } = req.body;

  conn.query(
    `INSERT INTO user SET nama='${nama}',alamat='${alamat}',username='${username}',password='${password}',phone='${phone}',ktp='${ktp}'`,
    (err, rows) => {
      if (err) {
        res.status(500).json(res.status);
      } else {
        res.status(200).json({ status: 200 });
      }
    }
  );
});

app.get("/user/detail/:id_user", (req, res) => {
  const { id_user } = req.params;

  conn.query(`SELECT * FROM user WHERE id_user='${id_user}'`, (err, rows) => {
    if (err) {
      res.status(500).json(res.status);
    } else {
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(400).json({ status: 400 });
      }
    }
  });
});

app.get("/booking/history/:id_user", (req, res) => {
  const { id_user } = req.params;

  conn.query(
    `SELECT * FROM booking WHERE id_user='${id_user}' AND status='Selesai'`,
    (err, rows) => {
      if (err) {
        res.status(500).json(res.status);
      } else {
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(400).json({ status: 400 });
        }
      }
    }
  );
});

app.get("/booking/list/:id_user", (req, res) => {
  const { id_user } = req.params;

  conn.query(
    `SELECT * FROM booking WHERE id_user='${id_user}' AND status!='Selesai'`,
    (err, rows) => {
      if (err) {
        res.status(500).json(res.status);
      } else {
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(400).json({ status: 400 });
        }
      }
    }
  );
});

app.post("/booking/add", (req, res) => {
  const { tanggal, jam_masuk, jam_keluar, total_jam, total_harga, id_user } =
    req.body;

  conn.query(
    `INSERT INTO booking SET tanggal='${tanggal}',jam_mulai='${jam_masuk}',jam_selesai='${jam_keluar}',total_jam='${total_jam}', harga='${total_harga}',id_user='${id_user}',status='Belum Bayar'`,
    (err, rows) => {
      if (err) {
        res.status(500).json(res.status);
        console.log(err);
      } else {
        res.status(200).json({ status: 200 });
      }
    }
  );
});

app.get("/notifikasi/list/:id_user", (req, res) => {
  const { id_user } = req.params;

  conn.query(
    `SELECT * FROM notifikasi WHERE id_user='${id_user}'`,
    (err, rows) => {
      if (err) {
        res.status(500).json(res.status);
      } else {
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(400).json({ status: 400 });
        }
      }
    }
  );
});

app.post("/notifikasi/delete/:id_notifikasi", (req, res) => {
  const { id_notifikasi } = req.params;

  conn.query(
    `DELETE FROM notifikasi WHERE id_notifikasi='${id_notifikasi}'`,
    (err, rows) => {
      if (err) {
        res.status(500).json(res.status);
      } else {
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(400).json({ status: 400 });
        }
      }
    }
  );
});

// Melakukan Koneksi
const server = http.createServer(app);
server.listen(process.env.PORT || 8000, () => {
  console.log("Connect With Port 8000");
});
