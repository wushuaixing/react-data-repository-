/**
 * created by anran on 2020-02-10.
 */
const proxy = require('http-proxy-middleware');
module.exports = function(app) {
	app.use(
		'/api/',
		proxy({
			target: 'http://172.18.255.74:8080',
			changeOrigin: true,
		})
	);
};
