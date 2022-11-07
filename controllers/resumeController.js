const fs = require("fs");
const path = require("path");
const handleError = require("./errorController");

module.exports = (req, res) => {
  const download = req.url.split("?")[1].split("=");
  var file = path.join(
    __dirname,
    "..",
    "resumes",
    req.url.split("/")[2].split("?")[0]
  );

  var filename = path.basename(file);
  if (download[0] === "download" && download[1] === "true") {
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", "application/pdf");

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  } else {
    fs.readFile(file, function (err, data) {
      if (err) {
        handleError(res, 404, err);
        return;
      }
      res.setHeader("Content-Type", "application/pdf");
      res.writeHead(200);
      res.end(data);
    });
  }
  return;
};
