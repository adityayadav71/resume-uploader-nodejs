module.exports = (
  res,
  statusCode,
  err,
  message = "Something went wrong, please try again!"
) => {
  res.writeHead(statusCode);
  if (process.env.NODE_ENV === "production")
    res.end(JSON.stringify({ message }));
  else res.end(JSON.stringify({ err }));
};
