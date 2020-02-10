/**
 * created by anran on 2020-02-10.
 */
const proxy = require('http-proxy-middleware');
module.exports = function(app) {
	app.use(
		'/',
		proxy({
			target: 'http://data.java.yczcjk.com',
			changeOrigin: true,
		})
	);
};
