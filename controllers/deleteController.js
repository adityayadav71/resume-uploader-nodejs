const fs = require("fs");
const path = require("path");
const db = require("../config/database.js");
const candidate = require("../models/candidates");
const handleError = require("./errorController");

async function deleteHandler(req, res) {
  const deleteFileCallback = () => {
    if (error) {
      handleError(res, 400, error, "Error in deleting file, please try again!");
    }
  };

  // Delete candidate's resume
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

  // Delete candidate from database
  candidate
    .destroy({
      where: {
        id: req.url.split("/")[2],
      },
    })
    .then(
      function (rowDeleted) {
        if (rowDeleted === 1) {
          // reset candidate table auto increment value for ID column to 1 less than the number of submissions received
          candidate
            .count()
            .then((count) =>
              db.query(
                `ALTER TABLE \`candidates\` AUTO_INCREMENT = ${
                  count - 1 > 0 ? count - 1 : 1
                }`
              )
            )
            .catch((err) => {
              handleError(res, 400, err);
            });
          res.end(JSON.stringify({ message: "Deleted successfully" }));
        }
      },
      function (err) {
        handleError(res, 400, err);
      }
    );
  return;
}

module.exports = deleteHandler;
