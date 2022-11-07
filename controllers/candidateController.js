const candidate = require("../models/candidates");

module.exports = (req, res) => {
  candidate
    .findAll()
    .then((data) =>
      res.end(JSON.stringify({ results: data.length, listings: data }))
    )
    .catch((err) => console.error(err));
};
