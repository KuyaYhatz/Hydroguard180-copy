// Global error handler middleware
exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Duplicate entry. This record already exists.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' });
  }
  if (err.code?.startsWith('P')) {
    return res.status(400).json({ error: 'Database error occurred.' });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error'
  });
};

// 404 handler
exports.notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};
