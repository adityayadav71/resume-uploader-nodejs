const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const countries = require("./data.json");
const host = "localhost";
const port = 5000;
const cors = require("cors");

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    case "/form":
      res.writeHead(200, { "content-type": "text/html" });
      const html = fs.readFileSync("./views/index.html");
      res.end(html);
      break;
    case "/countries":
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.writeHead(200);
      res.end(JSON.stringify(countries.data));
      break;
    case "/uploadData":
      let rawData = "";
      req
        .on("data", (data) => (rawData += data))
        .on("end", () => {
          req.post = qs.parse(rawData);
          console.log(req.post);
          res.end("Thanks for uploading your Data!");
        });
      break;
    default:
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Resource not found" }));
  }
};
const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on port ${port}`);
});
