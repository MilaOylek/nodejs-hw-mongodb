export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
