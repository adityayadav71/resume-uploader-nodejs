const fs = require("fs");
const path = require("path");
module.exports = (req, res) => {
  const download = req.url.split("?")[1].split("=");

  if (download[0] === "download" && download[1] === "true") {
    var file = path.join(
      __dirname,
      "..",
      "resumes",
      req.url.split("/")[2].split("?")[0]
    );

    var filename = path.basename(file);

    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", "application/pdf");

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  } else {
    fs.readFile(__dirname + req.url.pathname, function (err, data) {
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
  return;
};
