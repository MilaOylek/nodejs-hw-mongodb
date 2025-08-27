export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const isProduction = process.env.NODE_ENV === 'production';
  const errorMessage = isProduction ? 'Something went wrong' : err.message;

  res.status(err.status || 500).json({
    status: err.status || 500,
    message: errorMessage,
    data: err.data || null,
  });
};
