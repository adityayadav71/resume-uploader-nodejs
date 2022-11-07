const { QueryTypes } = require("sequelize");
const db = require("../config/database.js");
const candidate = require("../models/candidates");

function deleteHandler(req, res) {
  candidate
    .destroy({
      where: {
        id: req.url.split("/")[2],
      },
    })
    .then(
      function (rowDeleted) {
        if (rowDeleted === 1) {
          candidate.count().then((count) =>
            db
              .query(
                `ALTER TABLE \`candidates\` AUTO_INCREMENT = ${
                  count - 1 > 0 ? count - 1 : 1
                }`
              )
              .then((result, metadata) => {
                console.log(result, metadata);
              })
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
