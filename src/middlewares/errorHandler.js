export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  const payload = {
    status,
    message: status === 500 ? "Something went wrong" : err.message || "Error",
    data: err.message || "Unexpected error",
  };

  res.status(status).json(payload);
}
