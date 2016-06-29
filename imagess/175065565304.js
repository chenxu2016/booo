fml.define("moLogger", ["jquery"], function(a, b) {
    function f() {
        window.PTP_PARAMS = window.PTP_PARAMS || {}, c.extend(window.PTP_PARAMS, {
            EnableLogMoGuJs: !1,
            uuid: "__mgjuuid",
            uid: "__ud_",
            platform: function() {
                var a = navigator.userAgent;
                return a.indexOf("meilishuo4android") != -1 || a.indexOf("meilishuo android") != -1 ? "24" : a.indexOf("meilishuo4ios") != -1 || a.indexOf("Meilishuo iPhone") != -1 ? "23" : /iphone|android|ipad/i.test(a) ? "34" : "33"
            },
            hrefRe: /http[s]?:\/\/\w+\.(meilishuo|mogujie)\.com([\/]|\/.*|)$/,
            mgjRe: /(meilishuo|mls):\/\//,
            isNativeRe: /(meilishuo|mls|mogujie)/i,
            nativeLog: {}
        })
    }
    var c = a("jquery");
    var d = function(a) {
            var b = document.cookie.match(new RegExp("(^| )" + a + "=([^;]*)(;|$)"));
            return b !== null ? decodeURIComponent(b[2]) : ""
        },
        e = function() {
            var a = document.createElement("script");
            a.src = "https://s10.mogucdn.com/__static/logger/0.1.3/logger.js", document.body.appendChild(a)
        };
    d("__mgjuuid") ? (f(), e()) : c.ajax({
        url: "http://portal.meilishuo.com/api/util/getUuid",
        type: "GET",
        dataType: "jsonp",
        success: function() {
            f(), e()
        }
    })
});