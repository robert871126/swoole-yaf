// md5加密
!function(a){var b=function(a,b){return a<<b|a>>>32-b},c=function(a,b){var c,d,e,f,g;return e=2147483648&a,f=2147483648&b,c=1073741824&a,d=1073741824&b,g=(1073741823&a)+(1073741823&b),c&d?2147483648^g^e^f:c|d?1073741824&g?3221225472^g^e^f:1073741824^g^e^f:g^e^f},d=function(a,b,c){return a&b|~a&c},e=function(a,b,c){return a&c|b&~c},f=function(a,b,c){return a^b^c},g=function(a,b,c){return b^(a|~c)},h=function(a,e,f,g,h,i,j){return a=c(a,c(c(d(e,f,g),h),j)),c(b(a,i),e)},i=function(a,d,f,g,h,i,j){return a=c(a,c(c(e(d,f,g),h),j)),c(b(a,i),d)},j=function(a,d,e,g,h,i,j){return a=c(a,c(c(f(d,e,g),h),j)),c(b(a,i),d)},k=function(a,d,e,f,h,i,j){return a=c(a,c(c(g(d,e,f),h),j)),c(b(a,i),d)},l=function(a){for(var b,c=a.length,d=c+8,e=(d-d%64)/64,f=16*(e+1),g=Array(f-1),h=0,i=0;c>i;)b=(i-i%4)/4,h=8*(i%4),g[b]=g[b]|a.charCodeAt(i)<<h,i++;return b=(i-i%4)/4,h=8*(i%4),g[b]=g[b]|128<<h,g[f-2]=c<<3,g[f-1]=c>>>29,g},m=function(a){var d,e,b="",c="";for(e=0;3>=e;e++)d=255&a>>>8*e,c="0"+d.toString(16),b+=c.substr(c.length-2,2);return b},n=function(a){var b,c,d;for(a=a.replace(/\x0d\x0a/g,"\n"),b="",c=0;c<a.length;c++)d=a.charCodeAt(c),128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(192|d>>6),b+=String.fromCharCode(128|63&d)):(b+=String.fromCharCode(224|d>>12),b+=String.fromCharCode(128|63&d>>6),b+=String.fromCharCode(128|63&d));return b};a.extend({md5:function(a){var d,e,f,g,o,p,q,r,s,J,b=Array(),t=7,u=12,v=17,w=22,x=5,y=9,z=14,A=20,B=4,C=11,D=16,E=23,F=6,G=10,H=15,I=21;for(a=n(a),b=l(a),p=1732584193,q=4023233417,r=2562383102,s=271733878,d=0;d<b.length;d+=16)e=p,f=q,g=r,o=s,p=h(p,q,r,s,b[d+0],t,3614090360),s=h(s,p,q,r,b[d+1],u,3905402710),r=h(r,s,p,q,b[d+2],v,606105819),q=h(q,r,s,p,b[d+3],w,3250441966),p=h(p,q,r,s,b[d+4],t,4118548399),s=h(s,p,q,r,b[d+5],u,1200080426),r=h(r,s,p,q,b[d+6],v,2821735955),q=h(q,r,s,p,b[d+7],w,4249261313),p=h(p,q,r,s,b[d+8],t,1770035416),s=h(s,p,q,r,b[d+9],u,2336552879),r=h(r,s,p,q,b[d+10],v,4294925233),q=h(q,r,s,p,b[d+11],w,2304563134),p=h(p,q,r,s,b[d+12],t,1804603682),s=h(s,p,q,r,b[d+13],u,4254626195),r=h(r,s,p,q,b[d+14],v,2792965006),q=h(q,r,s,p,b[d+15],w,1236535329),p=i(p,q,r,s,b[d+1],x,4129170786),s=i(s,p,q,r,b[d+6],y,3225465664),r=i(r,s,p,q,b[d+11],z,643717713),q=i(q,r,s,p,b[d+0],A,3921069994),p=i(p,q,r,s,b[d+5],x,3593408605),s=i(s,p,q,r,b[d+10],y,38016083),r=i(r,s,p,q,b[d+15],z,3634488961),q=i(q,r,s,p,b[d+4],A,3889429448),p=i(p,q,r,s,b[d+9],x,568446438),s=i(s,p,q,r,b[d+14],y,3275163606),r=i(r,s,p,q,b[d+3],z,4107603335),q=i(q,r,s,p,b[d+8],A,1163531501),p=i(p,q,r,s,b[d+13],x,2850285829),s=i(s,p,q,r,b[d+2],y,4243563512),r=i(r,s,p,q,b[d+7],z,1735328473),q=i(q,r,s,p,b[d+12],A,2368359562),p=j(p,q,r,s,b[d+5],B,4294588738),s=j(s,p,q,r,b[d+8],C,2272392833),r=j(r,s,p,q,b[d+11],D,1839030562),q=j(q,r,s,p,b[d+14],E,4259657740),p=j(p,q,r,s,b[d+1],B,2763975236),s=j(s,p,q,r,b[d+4],C,1272893353),r=j(r,s,p,q,b[d+7],D,4139469664),q=j(q,r,s,p,b[d+10],E,3200236656),p=j(p,q,r,s,b[d+13],B,681279174),s=j(s,p,q,r,b[d+0],C,3936430074),r=j(r,s,p,q,b[d+3],D,3572445317),q=j(q,r,s,p,b[d+6],E,76029189),p=j(p,q,r,s,b[d+9],B,3654602809),s=j(s,p,q,r,b[d+12],C,3873151461),r=j(r,s,p,q,b[d+15],D,530742520),q=j(q,r,s,p,b[d+2],E,3299628645),p=k(p,q,r,s,b[d+0],F,4096336452),s=k(s,p,q,r,b[d+7],G,1126891415),r=k(r,s,p,q,b[d+14],H,2878612391),q=k(q,r,s,p,b[d+5],I,4237533241),p=k(p,q,r,s,b[d+12],F,1700485571),s=k(s,p,q,r,b[d+3],G,2399980690),r=k(r,s,p,q,b[d+10],H,4293915773),q=k(q,r,s,p,b[d+1],I,2240044497),p=k(p,q,r,s,b[d+8],F,1873313359),s=k(s,p,q,r,b[d+15],G,4264355552),r=k(r,s,p,q,b[d+6],H,2734768916),q=k(q,r,s,p,b[d+13],I,1309151649),p=k(p,q,r,s,b[d+4],F,4149444226),s=k(s,p,q,r,b[d+11],G,3174756917),r=k(r,s,p,q,b[d+2],H,718787259),q=k(q,r,s,p,b[d+9],I,3951481745),p=c(p,e),q=c(q,f),r=c(r,g),s=c(s,o);return J=m(p)+m(q)+m(r)+m(s),J.toLowerCase()}})}(jQuery);

var globalPostAble = true;
var ROOT = {
	apiurl:window.location.href.indexOf('news.mygxt.com') > -1?'http://news.mygxt.com/Admin/':'http://192.168.50.221:8082/Admin/',
	pattern: new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]","g"),
	ISFIRST: true, 
	storageStr: "xwt_",
	storage: window.localStorage,
	time:function(){
		var today = new Date();
		return [today.getFullYear(), today.getMonth() + 1, today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()].join('');
	},
	sign:function(param){
		var temparray = [];
		for(var k in param){
			if( k != 'sign'){
				temparray.push(k);
			}
		} 
		temparray.sort();
		var temp= [];
		for(var i = 0; i < temparray.length; i++){
			var _signReg = /\]$/;
			var _testRes = _signReg.test(temparray[i]);
			var _type = typeof param[temparray[i]];
			if(_testRes == false && _type != "object"){
				temp.push('' + temparray[i] + param[temparray[i]]);
			}
			delete(_testRes);
		}
		param['sign'] = $.md5(temp.join(''));
	},
	request:function(api, param, func, trace){
		param = param || {};
		param['timestamp'] = this.time();
		//param['command'] = api;
		this.sign(param);
		if(trace) $.trace(param);
		var _url = this.apiurl+api;
		$.post(_url, param, function(data){
			data = eval('('+data+')');
			if(trace) $.trace(data);
			if(data.status == -1){
				top.location.href = window.location.href.indexOf('news.mygxt.com') > -1?"http://nadmin.mygxt.com/":"http://192.168.50.221:8086";
			} else {
				if(func) func(data);
			}
		});
	},
	setItem: function (option, func) {
		for(var c in option) {
			this.storage.setItem(this.storageStr+c, option[c]);
		}
		if(func) return func();
	},
	getItem: function (name) {
		if(name == "token" && !(this.storage.getItem(this.storageStr+name))){
			return "b111772ee828b0527728eb11a8cfeb4d";
		}
		return this.storage.getItem(this.storageStr+name);
	},
	getAllItem: function () {
		return this.storage.valueOf();
	},
	removeItem: function (name) {
		var type = typeof name;
		if (type === "object") {
			for(var i = 0; i < name.length; i++)
				this.storage.removeItem(this.storageStr+name[i]);
		} else if(type === "string"){
			this.storage.removeItem(this.storageStr+name);
		}
	},

	// cookie
	setCookie: function (name,value){
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	},
	getCookie: function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	delCookie: function (name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=getCookie(name);
		if(cval!=null)
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
};
$.extend({
	ROOT:ROOT,
	trace:function(data){ try{ console.log(data); } catch(e){ }; },
	loadScript:function(path, func){
		$.getScript(path, func);
	},

	/*
    * 剩余字数统计
    * 注意 最大字数只需要在放数字的节点哪里直接写好即可 如：<var class="word">200</var>
    */
	textAreaStatInputNum: function (textarea, tips) {

		var max = textarea.attr('maxlength'),
            curLength;
        curLength = textarea.val().length;
        tips.text(curLength+'/'+max+'字');
        textarea.on('input propertychange', function () {
            tips.text($(this).val().length+'/'+max+'字');
        });
	},
	getQueryString: function(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	},
	getLocalTime: function (nS, full) {
		var full = full || false;
		var t, time;
		if(nS){
			t = typeof nS == 'number' ? nS : parseInt(nS);
			time = new Date(nS*1000);
		} else {
			time = new Date();
		}
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();

		if (full)
			return y+'-'+this.addZero(m)+'-'+this.addZero(d)+' '+this.addZero(h)+':'+this.addZero(mm)+':'+this.addZero(s);
		else
			return y+'-'+this.addZero(m)+'-'+this.addZero(d);
	},
	addZero: function(m){
		return m<10?'0'+m:m;
	},
	delHtmlTag: function (str){
		return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
	},
	// 复选框 全选/反选
	// obj: 全选（反选）checkbox id
	// objbox： 单选checkbox容器 id
	checkAll: function(obj, objbox) {
		$("#"+obj).click(function () {
			var checked = $(this).prop("checked");
			if(!checked) {
				$("#"+objbox).find("input[type='checkbox']").each(function (i) {
					$(this).prop("checked", false);
					$(this).parents("tr").css({"background-color": ""});
				});
			} else {
				$("#"+objbox).find("input[type='checkbox']").each(function (i) {
					$(this).prop("checked", true);
					$(this).parents("tr").css({"background-color": "#fdf6e6"});
				});
			}
		});
	},
	/*
	 * 功能：上传图片
	 * 依赖：layer弹窗插件
	 */
	uploads: function (api, objId, param, func) {
	 	var param = param || {};
	 	param['token'] = $.ROOT.getItem("token");
		param['timestamp'] = $.ROOT.time();

		$.ROOT.sign(param);  
	      //上传文件
	    // console.log(0);return false;
	    $.ajaxFileUpload({
	        url:$.ROOT.apiurl + api,//处理图片脚本
	        secureuri :false,
	        fileElementId : objId,//file控件id
	        dataType : 'json',
	        data: param,
	        success : function (data){
	        	$("#buttonUpload").siblings(".loading").remove();
	        	$("#fileToUpload").replaceWith('<input type="file" id="fileToUpload" name="fileToUpload" onchange="changeVal(this)" value="选择图片">');
				if(func) func(data);
	        },
	        error: function(data, status, e){
	        	
	        }
		})
		return false;
	},
	/*
	 * 功能：删除节点
	 * 依赖：layer弹窗插件
	 */
	deleteNode: function (api, param, msg, func) {
		var i = layer.confirm(msg, {
			btn: ['确定','取消'] //按钮
		}, function(){
			var _param = {token: $.ROOT.getItem("token")};
			$.extend(_param, param);
			layer.close(i);
			var loading = layer.load(1, {
				shade: [0.5,'#000'] //0.1透明度的白色背景
			});
			$.ROOT.request(api, _param, function (data) {
				layer.close(loading);
				return func(data);
			});
		}, function(){
			
		});
	},

	/*
	 * 功能：回收站-还原
	 * 依赖：layer弹窗插件
	 */
	replyNode: function (api, param, msg, func) {
		var i = layer.confirm(msg, {
			btn: ['确定','取消'] //按钮
		}, function(){
			var _param = {token: $.ROOT.getItem("token")};
			$.extend(_param, param);
			layer.close(i);
			var loading = layer.load(1, {
				shade: [0.5,'#000'] //0.1透明度的白色背景
			});
			$.ROOT.request(api, _param, function (data) {
				layer.close(loading);
				return func(data);
			});
		}, function(){
			
		});
	},

	/*
	 * 功能：列表-发布文章
	 * 依赖：layer弹窗插件
	 */
	publishArticle: function (api, param, func) {
		var i = layer.confirm('确定要发布此资讯吗？', {
			btn: ['确定','取消'] //按钮
		}, function(){
			var _param = {token: $.ROOT.getItem("token")};
			$.extend(_param, param);
			layer.close(i);
			var loading = layer.load(1, {
				shade: [0.5,'#000'] 
			});
			$.ROOT.request(api, _param, function (data) {
				layer.close(loading);
				return func(data);
			});
		}, function(){
			
		});
	},

	/*
	 * 功能：列表-取消发布文章
	 * 依赖：layer弹窗插件
	 */
	unpublishArticle: function (api, param, func) {
		var i = layer.confirm('确定要取消发布此资讯吗？', {
			btn: ['确定','取消'] //按钮
		}, function(){
			var _param = {token: $.ROOT.getItem("token")};
			$.extend(_param, param);
			layer.close(i);
			var loading = layer.load(1, {
				shade: [0.5,'#000'] 
			});
			$.ROOT.request(api, _param, function (data) {
				layer.close(loading);
				return func(data);
			});
		}, function(){
			
		});
	},

	/*
	 * 功能：summernote 富文本图片上传
	 * 依赖：layer弹窗插件, ajaxFileUpload上传插件
	 */
	summernoteImgUpload: function (api, objId, files, editor, $editable, func) {
		var param = param || {};
	 	param['token'] = $.ROOT.getItem("token");
		param['timestamp'] = $.ROOT.time();

	    var url = $.ROOT.apiurl + api;
		$.ROOT.sign(param);  
	      //上传文件
		var index = layer.load(1, {
			shade: [0.5,'#000']
		});
	    $.ajaxFileUpload({
	        url: url,//处理图片脚本
	        secureuri :false,
	        fileElementId : objId,//file控件id
	        dataType : 'json',
	        data: param,
	        success : function (data){
	        	if(data.status == 1){
	        		editor.insertImage($editable, data.url);
	        		layer.close(index);
	        	}
	        },
	        error: function(data, status, e){
	        	layer.close(index);
	        	layer.msg(data);
	        }
		})
		return false;
	}
});

$(function () {
	$.checkAll("checkAll", "listBox");
	$("#listBox").find("input[type='checkbox']").click(function () {
		var checked = $(this).prop("checked");
		if(checked){
			$(this).parents("tr").css({"background-color": "#fdf6e6"});
		} else {
			$(this).parents("tr").css({"background-color": ""});
		}
	});
});