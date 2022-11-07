const candidate = require("../models/candidates");
const handleError = require("./errorController");

module.exports = (req, res, sort, order) => {
  if (sort && order) {
    candidate
      .findAll({
        order: [[sort, order]],
      })
      .then((data) =>
        res.end(JSON.stringify({ results: data.length, listings: data }))
      )
      .catch((err) => {
        handleError(res, 400, err);
      });
  } else {
    candidate
      .findAll()
      .then((data) =>
        res.end(JSON.stringify({ results: data.length, listings: data }))
      )
      .catch((err) => {
        handleError(res, 400, err);
      });
  }
};
