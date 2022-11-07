const fs = require("fs");
const path = require("path");
const db = require("../config/database.js");
const candidate = require("../models/candidates");

async function deleteHandler(req, res) {
  const deleteFileCallback = () => {
    if (error) {
      if (process.env.NODE_ENV === "development")
        console.log("Error in deleting file");
      else res.end(JSON.stringify({ message: "Something went wrong" }));
    }
  };
  let resumePath = await candidate.findOne({
    where: {
      id: req.url.split("/")[2],
    },
    attributes: ["resumePath"],
  });
  fs.unlinkSync(
    path.join(__dirname, "..", resumePath.dataValues.resumePath),
    deleteFileCallback
  );

  candidate
    .destroy({
      where: {
        id: req.url.split("/")[2],
      },
    })
    .then(
      function (rowDeleted) {
        if (rowDeleted === 1) {
          candidate
            .count()
            .then((count) =>
              db.query(
                `ALTER TABLE \`candidates\` AUTO_INCREMENT = ${
                  count - 1 > 0 ? count - 1 : 1
                }`
              )
            );
          res.end(JSON.stringify({ message: "Deleted successfully" }));
        }
      },
      function (err) {
        if (process.env.NODE_ENV === "production")
          res.end(JSON.stringify({ message: "Something went wrong!" }));
        else res.end(JSON.stringify({ error: err }));
      }
    );
  return;
}

module.exports = deleteHandler;
