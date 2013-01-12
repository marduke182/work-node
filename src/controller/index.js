
/*
 * GET home page.
 */

var account = require('./account.js');

exports.controllers = function(app,model){
    account.actions(app,model);
};
