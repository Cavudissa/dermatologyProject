'use strict';
module.exports = function () {
    //4XX - URLs not found
    return function customRaiseUrlNotFoundError(req, res, next) {
     // catch 404 and forward to error handler
        var err = new Error('Oops!!! unfortunately the page was not found, make sure you wrote the right url');
        res.status(404)
        res.render('errorView',{code:404,msg:err})
    };
};