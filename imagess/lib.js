;(function (root, undefined) {
	'use strict';

	var library = {
		'version': '2.1.2',
		'x86': {}
	};


	function _x86Multiply(m, n) {
		return ((m & 0xffff) * n) + ((((m >>> 16) * n) & 0xffff) << 16);
	}


	function _x86Rotl(m, n) {
		return (m << n) | (m >>> (32 - n));
	}


	function _x86Fmix(h) {
		h ^= h >>> 16;
		h  = _x86Multiply(h, 0x85ebca6b);
		h ^= h >>> 13;
		h  = _x86Multiply(h, 0xc2b2ae35);
		h ^= h >>> 16;

		return h;
	}


	function _x64Add(m, n) {
		m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
		n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
		var o = [0, 0, 0, 0];

		o[3] += m[3] + n[3];
		o[2] += o[3] >>> 16;
		o[3] &= 0xffff;

		o[2] += m[2] + n[2];
		o[1] += o[2] >>> 16;
		o[2] &= 0xffff;

		o[1] += m[1] + n[1];
		o[0] += o[1] >>> 16;
		o[1] &= 0xffff;

		o[0] += m[0] + n[0];
		o[0] &= 0xffff;

		return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
	}


	function _x64Multiply(m, n) {

		m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
		n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
		var o = [0, 0, 0, 0];

		o[3] += m[3] * n[3];
		o[2] += o[3] >>> 16;
		o[3] &= 0xffff;

		o[2] += m[2] * n[3];
		o[1] += o[2] >>> 16;
		o[2] &= 0xffff;

		o[2] += m[3] * n[2];
		o[1] += o[2] >>> 16;
		o[2] &= 0xffff;

		o[1] += m[1] * n[3];
		o[0] += o[1] >>> 16;
		o[1] &= 0xffff;

		o[1] += m[2] * n[2];
		o[0] += o[1] >>> 16;
		o[1] &= 0xffff;

		o[1] += m[3] * n[1];
		o[0] += o[1] >>> 16;
		o[1] &= 0xffff;

		o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
		o[0] &= 0xffff;

		return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
	}


	function _x64Rotl(m, n) {

		n %= 64;

		if (n === 32) {
			return [m[1], m[0]];
		}

		else if (n < 32) {
			return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
		}

		else {
			n -= 32;
			return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
		}
	}


	function _x64LeftShift(m, n) {

		n %= 64;

		if (n === 0) {
			return m;
		}

		else if (n < 32) {
			return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
		}

		else {
			return [m[1] << (n - 32), 0];
		}
	}


	function _x64Xor(m, n) {

		return [m[0] ^ n[0], m[1] ^ n[1]];
	}


	function _x64Fmix(h) {

		h = _x64Xor(h, [0, h[0] >>> 1]);
		h = _x64Multiply(h, [0xff51afd7, 0xed558ccd]);
		h = _x64Xor(h, [0, h[0] >>> 1]);
		h = _x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
		h = _x64Xor(h, [0, h[0] >>> 1]);

		return h;
	}


	library.x86.hash128 = function (key, seed) {

		key = key || '';
		seed = seed || 0;

		var remainder = key.length % 16;
		var bytes = key.length - remainder;

		var h1 = seed;
		var h2 = seed;
		var h3 = seed;
		var h4 = seed;

		var k1 = 0;
		var k2 = 0;
		var k3 = 0;
		var k4 = 0;

		var c1 = 0x239b961b;
		var c2 = 0xab0e9789;
		var c3 = 0x38b34ae5;
		var c4 = 0xa1e38b93;

		for (var i = 0; i < bytes; i = i + 16) {
			k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24);
			k2 = ((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24);
			k3 = ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24);
			k4 = ((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24);

			k1 = _x86Multiply(k1, c1);
			k1 = _x86Rotl(k1, 15);
			k1 = _x86Multiply(k1, c2);
			h1 ^= k1;

			h1 = _x86Rotl(h1, 19);
			h1 += h2;
			h1 = _x86Multiply(h1, 5) + 0x561ccd1b;

			k2 = _x86Multiply(k2, c2);
			k2 = _x86Rotl(k2, 16);
			k2 = _x86Multiply(k2, c3);
			h2 ^= k2;

			h2 = _x86Rotl(h2, 17);
			h2 += h3;
			h2 = _x86Multiply(h2, 5) + 0x0bcaa747;

			k3 = _x86Multiply(k3, c3);
			k3 = _x86Rotl(k3, 17);
			k3 = _x86Multiply(k3, c4);
			h3 ^= k3;

			h3 = _x86Rotl(h3, 15);
			h3 += h4;
			h3 = _x86Multiply(h3, 5) + 0x96cd1c35;

			k4 = _x86Multiply(k4, c4);
			k4 = _x86Rotl(k4, 18);
			k4 = _x86Multiply(k4, c1);
			h4 ^= k4;

			h4 = _x86Rotl(h4, 13);
			h4 += h1;
			h4 = _x86Multiply(h4, 5) + 0x32ac3b17;
		}

		k1 = 0;
		k2 = 0;
		k3 = 0;
		k4 = 0;

		switch (remainder) {
			case 15:
				k4 ^= key.charCodeAt(i + 14) << 16;

			case 14:
				k4 ^= key.charCodeAt(i + 13) << 8;

			case 13:
				k4 ^= key.charCodeAt(i + 12);
				k4 = _x86Multiply(k4, c4);
				k4 = _x86Rotl(k4, 18);
				k4 = _x86Multiply(k4, c1);
				h4 ^= k4;

			case 12:
				k3 ^= key.charCodeAt(i + 11) << 24;

			case 11:
				k3 ^= key.charCodeAt(i + 10) << 16;

			case 10:
				k3 ^= key.charCodeAt(i + 9) << 8;

			case 9:
				k3 ^= key.charCodeAt(i + 8);
				k3 = _x86Multiply(k3, c3);
				k3 = _x86Rotl(k3, 17);
				k3 = _x86Multiply(k3, c4);
				h3 ^= k3;

			case 8:
				k2 ^= key.charCodeAt(i + 7) << 24;

			case 7:
				k2 ^= key.charCodeAt(i + 6) << 16;

			case 6:
				k2 ^= key.charCodeAt(i + 5) << 8;

			case 5:
				k2 ^= key.charCodeAt(i + 4);
				k2 = _x86Multiply(k2, c2);
				k2 = _x86Rotl(k2, 16);
				k2 = _x86Multiply(k2, c3);
				h2 ^= k2;

			case 4:
				k1 ^= key.charCodeAt(i + 3) << 24;

			case 3:
				k1 ^= key.charCodeAt(i + 2) << 16;

			case 2:
				k1 ^= key.charCodeAt(i + 1) << 8;

			case 1:
				k1 ^= key.charCodeAt(i);
				k1 = _x86Multiply(k1, c1);
				k1 = _x86Rotl(k1, 15);
				k1 = _x86Multiply(k1, c2);
				h1 ^= k1;
		}

		h1 ^= key.length;
		h2 ^= key.length;
		h3 ^= key.length;
		h4 ^= key.length;

		h1 += h2;
		h1 += h3;
		h1 += h4;
		h2 += h1;
		h3 += h1;
		h4 += h1;

		h1 = _x86Fmix(h1);
		h2 = _x86Fmix(h2);
		h3 = _x86Fmix(h3);
		h4 = _x86Fmix(h4);

		h1 += h2;
		h1 += h3;
		h1 += h4;
		h2 += h1;
		h3 += h1;
		h4 += h1;

		return ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8);
	};


	root.murmurHash3 = library;
})(this);
/*
https://github.com/jackspirou/clientjs/blob/master/src/client.js
*/
(function(global){

	switch(global.location.hostname){
			case 'www.meilishuo.com' :
			case 'wap.meilishuo.com' :
			case 'm.meilishuo.com' :
			case 'mapp.meilishuo.com' :
			case 'pages.w.meilishuo.com' :
				break
			default:
				return
	}

	
	
	var FALCONUID
	var ua = navigator.userAgent;
	/*http://findsupport.xyz/question/6122571/simple-non-secure-hash-function-for-javascript */

	function getDeviceYDPI(){
		return screen.deviceYDPI;
	}

	function getDeviceXDPI() {
		return screen.deviceXDPI;
	}
	function getColorDepth(){
		return screen.colorDepth;
	}
	function getAvailableResolution(){
		return screen.availWidth + "x" + screen.availHeight;
	}
	function getCurrentResolution(){
		 return screen.width + "x" + screen.height;
	}
	function getScreenPrint (){
		return "Current Resolution: " + getCurrentResolution() + ", Avaiable Resolution: " + getAvailableResolution() +
				", Color Depth: " + getColorDepth() + ", Device XDPI: " + getDeviceXDPI() + ", Device YDPI: " + getDeviceYDPI();
	}

	function getPlugins(){
		var pluginsList = "";

		for (var i=0; i< navigator.plugins.length; i++) {
				if( i == navigator.plugins.length-1 ) {
					pluginsList += navigator.plugins[i].name;
				}else{
					pluginsList += navigator.plugins[i].name + ", ";
				}
		}
		return pluginsList;
	}
	function isLocalStorage(){
		try {
			return !!global.localStorage;
		} catch(e) {
			return true;
		}
	}
	function isCookie(){
		return navigator.cookieEnabled;
	}

	function getTimeZone(){
		var rightNow = new Date();
		return String(String(rightNow).split("(")[1]).split(")")[0];
	}

	function getLanguage(){
		return navigator.language;
	}
	function getSystemLanguage(){
		return navigator.systemLanguage;
	}
	function getCanvasPrint(){
		var canvas = document.createElement('canvas');
		var ctx;
		try {
			ctx = canvas.getContext('2d');
		} catch(e) {
			return "";
		}
		var txt = 'http://valve.github.io';
		ctx.textBaseline = "top";
		ctx.font = "14px 'Arial'";
		ctx.textBaseline = "alphabetic";
		ctx.fillStyle = "#f60";
		ctx.fillRect(125,1,62,20);
		ctx.fillStyle = "#069";
		ctx.fillText(txt, 2, 15);
		ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
		ctx.fillText(txt, 4, 17);
		return canvas.toDataURL();

	}

	function getFingerprint() {
		var bar             = '|';

		var userAgent       = ua;
		var screenPrint     = getScreenPrint();
		var pluginList      = getPlugins();
		var fontList        = ''; /*getFonts();*/
		var localStorage    = isLocalStorage();
		var timeZone        = getTimeZone();
		var language        = getLanguage();
		var systemLanguage  = getSystemLanguage();
		var cookies         = isCookie();
		var canvasPrint     = getCanvasPrint();

		var key = [userAgent , screenPrint , pluginList , fontList , localStorage ,  timeZone ,
				language , systemLanguage , cookies , canvasPrint].join(bar);
		var seed = 256;

		/*return murmurhash3_32_gc(key, seed);*/
		return murmurHash3.x86.hash128(key, seed);
    }
	function read_cookie(k){return(document.cookie.match('(^|; )'+k+'=([^;]*)')||0)[2]}
	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function uid(){
		var cookie_name = '__falconid';
		var falconid = read_cookie(cookie_name);
		if (falconid) return falconid;
		falconid = getFingerprint();
		createCookie(cookie_name , falconid ,300);
		return falconid;
	}

	var scrpt;
	var head = document.head  || document.getElementsByTagName('head')[0] || document.documentElement;
	~function(){
		scrpt = document.currentScript;
		if (!scrpt) {
			scrpt = (function(){
				var _scripts = document.scripts;
				for(var i = _scripts.length-1; i>= 0 ; i--){
					if (_scripts[i].src && _scripts[i].src.indexOf('.com/falcon/lib.js') > 0) return _scripts[i]
				}
				return null;
			})()
		}
		if (scrpt && scrpt.src) {
			scrpt = scrpt.src.match(/\:\/\/([^\/]+)\//)[1] ;
		}
	}()

	function send(src){
		if (!scrpt) return
		src =  'http://' + scrpt + src;
		var l = document.createElement('script');
        l.type = 'text/javascript';
        l.src = src ;
		l.async = true;
		l.defer = true;
		global.setTimeout(function(){
			head.appendChild(l);
		},100)
	}

	function clickRequest(param){
		var q = param
		if ('object' == typeof param){
			q = []
			for(var i in param){
				q.push(i + '=' + encodeURIComponent(param[i]))
			}
			q = '?' + q.join('&')
		}
		sendNoop('/noop/' + FALCONUID + '/cr/'  + q)
	}

	function sendNoop(src){
		if (!scrpt) return
		var t = new Image
		src =  'http://' + scrpt + src;
		t.src = src
	}

	function init(){
		FALCONUID = uid();
		global.Falcon = {
			'clientId' : FALCONUID
			,'cr' : clickRequest
		}
		var host = global.location.hostname
		var path = global.location.pathname

		switch (host){
			case 'pages.w.meilishuo.com':
				path = path.replace(/\/\w{24}$/,'/-d')
				break
			default:
				path = path.replace(/\/\d+$/,'/-d')
				if( path.indexOf('/book/') === 0 ) path = '/book/-s'
				else if( path.indexOf('/guang/brand/') === 0) path = '/guang/brand/'
				else if( path.indexOf('/guang/catalog/') === 0) path = '/guang/catalog/'
				else if( path.indexOf('/guang/') === 0) path = '/guang/-s'
				else if( path.indexOf('/help') === 0) path = '/help/-s'
				else if( path.indexOf('/page') === 0) path = '/page/-s'
				else if( path.indexOf('/share/item') === 0) path = '/share/item/-d'
				else if( path.indexOf('/share') === 0) path = '/share/-d'
				else if( path.indexOf('/shop') === 0) path = '/shop/-d'
				else if( path.indexOf('/topic/hot') === 0) path = '/topic/hot/-d'
				else if( path === '/' || path.indexOf('/welcome') == 0 ) path = '/'
		}
		//pv id 
		//onbeforunload 发送埋点  存入localStorage
		var pvProfile = {}
		pvProfile.start = +new Date
		pvProfile.id =  pvProfile.start.toString(32) + Math.random().toString(32).slice(-5)

		sendNoop('/noop/' + FALCONUID + '/pv/?refer=' + encodeURIComponent(document.referrer) + '&pvid=' + encodeURIComponent(pvProfile.id))

		_old_event = global.onbeforeunload
		global.onbeforeunload = function(){
			_old_event && _old_event()
			pvProfile.timeLive = new Date - pvProfile.start
			sendNoop('/noop/' + FALCONUID + '/po/?pvid=' + encodeURIComponent(pvProfile.id) + '&tl=' + pvProfile.timeLive)
			/*
			if (isLocalStorage()) {
				var his = localStorage.getItem('pvout') 
				if ( his && his.length){
					for (var i =0 ,j=his.length; i< j;i++){
						var prof = his[i]
						sendNoop('/noop/' + FALCONUID + '/po/?pvid=' + encodeURIComponent(profile.id) + '&tl=' + profile.timeLive)
					}
					
					his = []		
				}
				his = his || []
				his.push({"id" : pvProfile.id ,"tl" : pvProfile.timeLive})
				localStorage.setItem('pvout' , his)
			} 
			 */
		}
		send('/falcon/lib.js/get/?host=' + encodeURIComponent(host) + '&path='+ encodeURIComponent(path) ) ;

	}

	init();


}(window))
