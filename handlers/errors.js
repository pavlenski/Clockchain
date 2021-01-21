function errorNotFound(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function errorHandler (err, req, res, next) {
    const error = app.get('env') == 'development' ? err : {};
    const status = err.status || 500;

    res.status(status).json({
        error: {
            message: error.message
        }
    });
    console.error(err);
}

module.exports = {
    errorNotFound,
    errorHandler
}
