const http = require("http");
const fs = require("fs");
require("dotenv").config();
const countries = require("./data.json");
const uploadHandler = require("./controllers/uploadController");
const deleteHandler = require("./controllers/deleteController");
const resumeHandler = require("./controllers/resumeController");
const candidateHandler = require("./controllers/candidateController");
const handleError = require("./controllers/errorController");
const db = require("./config/database.js");

// 1. Test DB connection
db.authenticate()
  .then(() => {
    if (process.env.NODE_ENV === "development")
      console.log("Database connected...");
  })
  .catch((err) => {
    handleError(res, 400, err);
  });

// 2. Function to serve HTML files
const serveHTML = (req, res, filepath) => {
  res.writeHead(200, { "content-type": "text/html" });
  return fs.readFileSync(filepath);
};
// prettier-ignore
// 3. Request Litener function specifying routes all routes accepted on the server
const requestListener = async function (req, res) {

  if (req.url.match(/\/resumes\/[^\n]+?download/) && req.method === "GET") {
    resumeHandler(req, res);
  } 
  else if (req.url === "/" && req.method === "GET") {
    res.end(serveHTML(req, res, "./views/index.html"));
  }
  else if (req.url === "/countries" && req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify(countries.data));
  } 
  else if (req.url === "/submissions" && req.method === "GET") {
    res.end(serveHTML(req, res, "./views/listing.html"));
  } 
  else if (req.url === "/listings" && req.method === "GET") {
    candidateHandler(req, res);
  } 
  else if (
    req.url.match(/\/listings\/[^\n]+\/[^\n]+/) &&
    req.method === "GET"
  ) {
    const filters = req.url.split("/");
    candidateHandler(req, res, filters[2], filters[3]);
  } 
  else if (req.url === "/uploadData" && req.method === "POST") {
    uploadHandler(req, res);
  } 
  else if (
    req.url.match(/\/deleteListing\/([0-9]+)/) &&
    req.method === "DELETE"
  ) {
    await deleteHandler(req, res);
  } 
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Could not find resource" }));
  }
};

// 4. Setup server
const server = http.createServer(requestListener);
const port = process.env.PORT || 5000;
server.listen(port, () => {
  if (process.env.NODE_ENV === "development")
    console.log(`Server is running on port ${port}`);
});
