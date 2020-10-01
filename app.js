'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const morgan = require('morgan');
const { logEntryRequest, stream, logger } = require('./config/logger');
module.exports = app; // for testing

require('dotenv').config();

app.use(logEntryRequest);

const morganType = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganType, { stream }));

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) { throw err; }

	// install middleware
	swaggerExpress.register(app);

	var port = process.env.PORT || 10010;
	app.listen(port);

	logger.info(`Server running on port ${port}`);
});
