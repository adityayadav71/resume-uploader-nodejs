const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const countries = require("./data.json");
const host = "localhost";
const port = 5000;
const formidable = require("formidable");
const db = require("./config/database.js");
const candidate = require("./models/candidates.js");

// Test DB
db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

const requestListener = function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  switch (req.url) {
    case "/form":
      res.writeHead(200, { "content-type": "text/html" });
      var html = fs.readFileSync("./views/index.html");
      res.end(html);
      break;
    case "/countries":
      res.writeHead(200);
      res.end(JSON.stringify(countries.data));
      break;
    case "/uploadData":
      const form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        console.log(fields);
        const oldpath = files.resume.filepath;
        const newpath = path.join(
          path.join(__dirname, "resumes"),
          `${files.resume.newFilename}.pdf`
        );
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
        });
        candidate
          .create({
            name: fields.name,
            dob: fields.dob,
            country: fields.countries,
            resumePath: `/resumes/${files.resume.newFilename}.pdf`,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
          })
          .then((data, err) => {
            try {
              res.end(
                JSON.stringify({
                  message: "Your Data has been uploaded successfully",
                })
              );
            } catch (err) {
              res.end(
                JSON.stringify({
                  error:
                    "Data could not be uploaded successfully! Please Try again.",
                })
              );
            }
          });
      });

      break;
    case "/submissions":
      res.writeHead(200, { "content-type": "text/html" });
      var html = fs.readFileSync("./views/listing.html");
      res.end(html);
      break;
    case "/listings":
      candidate
        .findAll()
        .then((data) =>
          res.end(JSON.stringify({ results: data.length, listings: data }))
        )
        .catch((err) => console.error(err));

      break;
    default:
      const parsedURL = require("url").parse(req.url);
      const download = Object.fromEntries(
        new URLSearchParams(parsedURL.query)
      ).download;
      console.log(download);
      if (download === "true") {
        console.log("download true");
        var file = __dirname + parsedURL.pathname;
        console.log(file);

        var filename = path.basename(file);
        console.log(filename);

        res.setHeader(
          "Content-disposition",
          "attachment; filename=" + filename
        );
        res.setHeader("Content-type", "application/pdf");

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      } else {
        console.log("download false");
        fs.readFile(__dirname + parsedURL.pathname, function (err, data) {
          if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
          }
          res.setHeader("Content-Type", "application/pdf");
          res.writeHead(200);
          res.end(data);
        });
      }
  }
};
const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on port ${port}`);
});
