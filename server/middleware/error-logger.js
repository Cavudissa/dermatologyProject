
module.exports = function(options) {
  return function logError(err, req, res, next) {
    res.status(err.status);
    res.render('errorView', {code: err.status, msg: err.message});
  };
};
