'use strict';

module.exports = function (app) {
    // Root routing
    var core = require('./api/EmailApi');

   // app.route('/server-error').get(core.renderServer.controller);
   // app.route('/not-found').get(core.renderNotFound);

    app.route('/*').post(core.renderIndex);

    // route for modemail
    app.route('/contact-form').post(core.sendMail);


};


