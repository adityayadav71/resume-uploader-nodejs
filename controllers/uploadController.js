const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const candidate = require("../models/candidates.js");
const countryData = require("../data.json");

function uploadHandler(req, res) {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    const oldpath = files.resume.filepath;
    const newpath = path.join(
      path.join("resumes"),
      `${files.resume.newFilename}.pdf`
    );
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });
    let countryName;
    countryData.data.forEach((country) => {
      if (country.code === fields.countries) {
        countryName = country.name;
      }
    });
    candidate
      .create({
        name: fields.name,
        dob: fields.dob,
        country: countryName,
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
          if (process.env.NODE_ENV === "production")
            res.end(
              JSON.stringify({
                message:
                  "Data could not be uploaded successfully! Please Try again.",
              })
            );
          else
            res.end(
              JSON.stringify({
                error: err,
              })
            );
        }
      });
  });
}

module.exports = uploadHandler;
