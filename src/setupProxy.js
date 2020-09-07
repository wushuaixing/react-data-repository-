/**
 * created by anran on 2020-02-10.
 */
const proxy = require('http-proxy-middleware');
module.exports = function(app) {
	app.use(
		'/api/',
		proxy({
			target: 'http://172.18.255.251:18088',
			changeOrigin: true,
		})
	);
};


// upstream server_test {
// 	server 172.18.255.251:18081;
// }
// upstream server_test {
// 	server 172.18.255.251:18081;
// }
//
// upstream server_pretest {
// 	server 172.18.255.251:18088;
// }
