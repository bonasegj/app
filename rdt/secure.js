const fs = require("fs");
const key = fs.readFileSync("./.ionic/ssl/key.pem");
const cert = fs.readFileSync("./.ionic/ssl/cert.pem");
const receta = fs.readFileSync("c:/temp/receta.pdf");
const express = require("express");
const app = express();

//const content="<!DOCTYPE html><html><head></head><body><h1>HOLA MUNDO!</body></html>"
const content = "";

app.get("/", (req, res, next) => {
  res.status(200);
  res.append("Content-Type", "application/pdf");
  res.append("Content-Disposition", 'attachment; filename="receta.pdf"');
  //res.append();
  res.send(receta);
});

const https = require("https");
const server = https.createServer({ key, cert }, app);

const port = 3100;
server.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});
