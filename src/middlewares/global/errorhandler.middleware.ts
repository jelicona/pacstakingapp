const logError = (err: any, req: any, res: any, next: any) => {
  // Log the error to a file or monitoring service
  console.error(err.stack);
  next(err);
}
const handleError = (err: any, req: any, res: any, next: any) => {
  // Send a generic error response
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
};

const boomErrorHandler = (err: any, req: any, res: any, next: any) => {
    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json({
            statusCode: output.statusCode,
            error: output.payload.error,
            message: output.payload.message,
            data: err.data || null,
        });
    } else {
        next(err);
    }
};

export { logError, handleError, boomErrorHandler };
