module.exports = {
    pluginOptions: {
        env: {
            state: process.env.NODE_ENV
        }
    },

    baseUrl: process.env.NODE_ENV === "production" ? "/" : "/",
    lintOnSave: true,
    productionSourceMap: false,
    devServer: {
        port: 8081, // 端口号
        host: "http://172.18.255.112",
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        proxy: {
            "/": {
                target: "http://data.java.yczcjk.com", // 需要请求的地址
                // target :"http://172.18.255.74:8080",
                ws: false
                /*   changeOrigin: true, // 是否跨域
                pathRewrite: {
                  "^/sell": "/" // 替换target中的请求地址，也就是说，在请求的时候，url用'/proxy'代替'http://ip.taobao.com'
                }*/
            }
        } // 配置多个代理
    }
};
