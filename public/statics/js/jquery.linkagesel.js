/**
 * javascript Infinite Level Linkage Select
 * javascript 无限级联动多功能菜单
 * 
 * Version 2.4 (2014-10-04)
 * @requires jQuery v1.6.0 or newer
 *
 * https://github.com/waitingsong/LinkageSel
 * Examples at: http://linkagesel.xiaozhong.biz/index_en.html
 * @Author waiting@xiaozhong.biz
 *
 * @copyright
 * Copyright (C) 2014 Waiting Song
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
"use strict";


;(function($) {
	var ajax = $.ajax;
	var pendingRequests = {};
	$.ajax = function(settings) {
		// create settings for compatibility with ajaxSetup
		settings = $.extend(settings, $.extend({}, $.ajaxSettings, settings));
		var port = settings.port;
		if (settings.mode == "abort") {
			if ( pendingRequests[port] ) {
				pendingRequests[port].abort();
			}
			return (pendingRequests[port] = ajax.apply(this, arguments));
		}
		return ajax.apply(this, arguments);
	};
})(jQuery);

var LinkageSel=function(c){var $=jQuery;var d=this;this.bindEls=[];this.data={'0':{}};this.recycle=[],this.st={mvcQuery:false,ie6:false,url:'',ajax:'',autoBind:true,autoHide:true,hideWidth:true,autoLink:true,cache:true,defVal:[],data:null,head:'Please select..',level:20,loaderImg:'',loader_duration:100,root:[],minWidth:120,maxWidth:300,fixWidth:0,select:[],selClass:'LinkageSel',selStyle:'',onChange:false,trigger:true,triggerValues:[],err:false,abort:false,dataReader:{}};if(c&&typeof c==='object'){$.extend(this.st,c)}if(!this.st.dataReader){this.st.dataReader={id:'id',name:'name',cell:'cell'}}else{(typeof this.st.dataReader.id==='undefined'||!this.st.dataReader.id)&&(this.st.dataReader.id='id');(typeof this.st.dataReader.name==='undefined'||!this.st.dataReader.name)&&(this.st.dataReader.name='name');(typeof this.st.dataReader.cell==='undefined'||!this.st.dataReader.cell)&&(this.st.dataReader.cell='cell')}this.st.selClass=$.trim(this.st.selClass);if(/msie/.test(navigator.userAgent.toLowerCase())){if($.browser&&$.browser.version&&$.browser.version=='6.0'){this.st.ie6=true}else if(!$.support.leadingWhitespace){this.st.ie6=true}}this.data[0][this.st.dataReader.name]='root';this.data[0][this.st.dataReader.val]=0;this.data[0][this.st.dataReader.cell]=this.st.data;this.innerCallback=this.st.onChange;this.st.onChange=false;var e=$('#linkagesel_loader');if(!e||!e[0]){$(document.body).append('<img id="linkagesel_loader" style="display: none; position: absolute;"  src="'+encodeURI(this.st.loaderImg||'')+'" />');this.loader=$('#linkagesel_loader')||null}else{this.loader=e}if(typeof this.st.select==='string'){this.st.select=[this.st.select]}else if(!isArray(this.st.select)){this.st.select=[]}if(isNumber(this.st.defVal)){this.st.defVal=[this.st.defVal]}else if(!isArray(this.st.defVal)){this.st.defVal=[]}if(isNumber(this.st.root)||!isNaN(+this.st.root)){this.st.root=[this.st.root]}else if(!isArray(this.st.root)){this.st.root=[]}var f=this.st.select.length;if(f<1){alert('没有对象被绑定到mLinkageSel()!');return false}for(var i=0;i<f;i++){this.bind((this.st.select)[i])}f=c=e=null;this.clean(0);this.fill(0,this.st.defVal[0]);this.outer={changeValues:function(a,b){d._changeValues(a,b);return this},getSelectedValue:function(a){return d._getSelectedValue(a)},getSelectedArr:function(){return d._getSelectedArr()},getSelectedData:function(a,b){return d._getSelectedData(a,b)},getSelectedDataArr:function(a){return d._getSelectedDataArr(a)},onChange:function(a){if(a&&typeof a==='function'){d.st.onChange=a}return this},reset:function(){d._reset();return this},resetAll:function(){d._reset(true);return this}};return this.outer};LinkageSel.prototype.bind=function(b){var c=this,st=this.st,bindEls=this.bindEls,bindIdx=bindEls.length||0,defValue=st.defVal&&st.defVal[bindIdx]||null,elm;if(!b){return false}if(typeof b==='string'){elm=jQuery(b).eq(0)}else if(typeof b==='object'){elm=b.jquery?b.eq(0):jQuery(b).eq(0)}if(!elm[0]||!elm.is('select')){return false}st.selClass&&(!elm.hasClass(st.selClass))&&elm.addClass(st.selClass);bindEls.push({obj:elm,value:defValue,defValue:defValue});elm.data('bindIdx',bindIdx).change(c,function(e){var a=c.st,bindEls=c,bindIdx=jQuery(this).data('bindIdx'),nextEl=bindEls[bindIdx+1]&&bindEls[bindIdx+1].obj||null,selected_value=null;if(!nextEl||!nextEl.find('option').length){selected_value=a.defVal&&a.defVal[bindIdx+1]||null}c.clean(bindIdx);c.fill(bindIdx+1,selected_value)});if(elm.is(':visible')){this.setWidth(elm)}bindIdx==0&&!st.data&&elm.change();return true};LinkageSel.prototype.creatSel=function(a,b){var c=this.st,bindEls=this.bindEls,str='';if(a<=0){return false}if(a>=c.level){this.custCallback();return false}var d='linkagesel_'+(''+Math.random()).slice(-6),str='<select id="'+d+'" style="display: none;'+c.selStyle+'" class="'+c.selClass+'" ></select>',elm=bindEls[a-1]['obj'].after(str);c.select.push(['#'+d]);this.bind('#'+d);if(typeof b==='function'){b(a,this)}return true};LinkageSel.prototype.fill=function(d,e){var f=this.bindEls,st=this.st,head=st.head,data=this.getData(d),tarr=[],bindEl,elm,row,recycle=this.recycle,recycleLen=recycle.length||0;this.setLoader(false);if(d>=st.level){this.custCallback();return false}if(st.triggerValues.length){e=st.triggerValues[d]||null}else{e=typeof e!=='undefined'&&e!==''?e:null}if(d>0&&(f[d-1].value===null||f[d-1].value==='')){bindEl=f[d]||{};elm=bindEl['obj'];if(elm&&elm[0]&&st.autoHide){st.hideWidth&&elm.hide()||elm.css('visibility','hidden')}st=f=data=null;this.custCallback();this.resetTrigger(true);return}if(data===false){this.clean(d-1);this.custCallback();this.resetTrigger(true);return}else if(data===null){if(st.url||st.ajax){this.getRemoteData(d-1,function(a,b){typeof b.bindEls[a]==='undefined'&&b.creatSel(a);var c=b.bindEls[a]&&b.bindEls[a].defValue||null;b.fill(a,c)})}else{this.custCallback();this.resetTrigger(true)}st=f=null;return}else if(data&&typeof data==='object'){if(f.length-1<d){this.creatSel(d)}bindEl=f[d]||{};elm=bindEl.obj;if(!elm||!elm[0]){return}if(head||typeof head==='string'){head='<option value="">'+head.entityify()+'</option>'}var g,index=1,selectedIdx=0,name=st.dataReader.name,id=st.dataReader.id;for(var x in data){if(!data.hasOwnProperty(x)){continue}row=data[x];typeof row[id]!=='undefined'&&row[id]&&(x=row[id]);if(recycleLen>0){g=recycle.pop();if(typeof g==='object'){g=jQuery(g).val(x).text(row[name]).prop('selected',false).get(0)}else{g=jQuery('<option>').val(x).text(row[name]).get(0)}recycleLen--}else{g=jQuery('<option>').val(x).text(row[name]).get(0)}tarr.push(g);if(e!==null&&e==x){selectedIdx=index}index++}row=g=null;if(st.autoLink&&index===2){selectedIdx--;bindEl.value=x;elm.append(tarr).show().css('visibility','');setTimeout(function(){elm.change()},0)}else{elm.append(head).append(tarr).css('visibility','').show();if(!head&&head!==''){setTimeout(function(){elm.change()},0)}else if(e&&!st.ie6){setTimeout(function(){elm.change()},0)}d&&this.custCallback()}tarr=recycle=null;selectedIdx--;if(!st.ie6){typeof elm[0].options[selectedIdx]==='object'&&(elm[0].options[selectedIdx].selected=true)}else{setTimeout(function(){typeof elm[0].options[selectedIdx]==='object'&&(elm[0].options[selectedIdx].selected=true);if(e){elm.change()}},0)}this.setWidth(elm)}st=f=data=bindEl=null};LinkageSel.prototype.findEntry=function(a){var b=this.st,root=b.root,len=root&&root.length||0;if(a&&len){for(var i=0;i<len;i++){if(!root[i]||!a[root[i]]||!a[root[i]][b.dataReader.cell]){break}else{a=a[root[i]][b.dataReader.cell]}}}return a};LinkageSel.prototype.getData=function(a){var b=this.st,bindEls=this.bindEls,data=this.data[0][b.dataReader.cell],len=bindEls.length,pValue,key;if(typeof a==='undefined'||a>=b.level){return false}if(a==-1){return this.data}data=this.findEntry(data);for(var i=1;i<=a;i++){pValue=bindEls[i-1].value;if(pValue&&data&&data[pValue]){if(data[pValue][b.dataReader.cell]===false){data=false}else{data=data[pValue][b.dataReader.cell]||null}}else{data=false;break}}b=bindEls=null;return data};LinkageSel.prototype.getRemoteData=function(c,d){var $=jQuery,that=this,st=this.st,bindEls=this.bindEls,bindValue=c>=0?bindEls[c].value:0,data,dv,cell,cache=st.cache?true:false;if(c>=st.level){return false}data=this.getData(c);dv=data[bindValue];if(!dv||typeof dv!=='object'||dv[st.dataReader.cell]===false){this.setLoader(false);this.custCallback();this.resetTrigger(true);return false}var e=0;for(var x in data){if(+x>0){e++;break}}if(st.ajax){var f={cache:cache,type:'GET',dataType:'json',mode:this.st.abort?'abort':'',context:that,beforeSend:function(){this.setLoader(c+1)},success:function(a){var b=this,loader_duration=b.loader_duration+20;setTimeout(function(){b.setLoader(false)},loader_duration);if(a&&typeof a==='object'&&!isArray(a)){dv[st.dataReader.cell]=a;d(c+1,this)}else{if(dv[st.dataReader.cell]===null){dv[st.dataReader.cell]=false}else{dv[st.dataReader.cell]=null}b.custCallback();b.resetTrigger(true)}},complete:function(){this.setLoader(false)}};if(st.mvcQuery){f.url=st.ajax+'/'+bindValue}else{f.url=st.ajax;f.data={};f.data[st.dataReader.id]=bindValue}$.ajax(f)}else if(st.url){$.getJSON(st.url,function(a){that.setLoader(false);if(a&&typeof a==='object'&&!isArray(a)){dv[st.dataReader.cell]=a;st.url='';d(c+1,that)}else{if(dv[st.dataReader.cell]===null){dv[st.dataReader.cell]=false}else{dv[st.dataReader.cell]=null;st.url=''}that.custCallback()}})}};LinkageSel.prototype._reset=function(a){var b=this.st,bindEls=this.bindEls,bindEl=bindEls[0]||{},elm=bindEl.obj||null,defValue=bindEl.defValue;if(elm){this.clean(0);if(defValue){elm.find("option[value='"+defValue+"']").eq(0).prop('selected',true);elm.change()}else{elm.prop('selectedIndex',0).change()}if(a){this.data[0][b.dataReader.cell]=b.data;this.clean(0);this.fill(0,b.select[0][1])}}b=bindEls=bindEl=elm=null};LinkageSel.prototype.clean=function(a){var b=this.st,bindEls=this.bindEls||[],len=bindEls.length,bindEl,elm,recycle=this.recycle,topt;if(a<0){return false}if(!len||a>=b.level){this.custCallback();return false}for(var i=len-1;i>a;i--){bindEl=bindEls[i]||{};elm=bindEl.obj;if(elm[0]&&elm.length){elm.scrollTop(0);topt=elm.children();topt.remove();topt.length&&(jQuery.merge(recycle,topt.filter('option').toArray()));if(b.autoHide){b.hideWidth&&elm.hide()||elm.css('visibility','hidden')}if(b.fixWidth){elm.width(b.fixWidth)}else if(b.minWidth){elm.width(b.minWidth)}bindEl.value=''}}bindEls[a]&&bindEls[a].obj&&(bindEls[a].value=bindEls[a].obj.val());b=bindEls=bindEl=elm=topt=null;return true};LinkageSel.prototype.calcWidth=function(n){var a=this.st,fixW=+a.fixWidth,minW=+a.minWidth,maxW=+a.maxWidth;if(minW>0&&maxW>0){minW=Math.min(minW,maxW);maxW=Math.max(minW,maxW)}if(fixW>0){n=fixW}else if(minW>0&&n<minW){n=minW}else if(maxW>0&&n>maxW){n=maxW}else{n=-1}a=null;return n<0?false:n};LinkageSel.prototype.setWidth=function(a){if(!a||!a[0]){return false}var w=this.calcWidth(a.width());if(w===false){a.width('')}else{a.width(w)}};LinkageSel.prototype.setLoader=function(a){var b=this.loader;if(!b){return}if(a===false){b.offset({top:0,left:0}).hide()}else{var c=this.bindEls,elm,offset,tmp,width,loader_duration=this.loader_duration;if(!c){return}for(var i=c.length-1;i>=a;i--){tmp=c[i]&&c[i].obj;if(tmp&&tmp.is(':visible')){elm=tmp;break}}if(!elm&&a>0){elm=c[a-1].obj}if(elm&&elm.is(':visible')){offset=elm.offset();width=elm.width();b.offset({top:(parseInt(offset.top)+3),left:(parseInt(offset.left+width+5))}).show(loader_duration)}else{b.hide(loader_duration).offset({top:0,left:0})}c=elm=tmp=null}};LinkageSel.prototype.custCallback=function(){var a=this.st;if(!a.trigger){return}if(this.innerCallback&&typeof this.innerCallback==='function'){this.innerCallback(this)}if(a.onChange&&typeof a.onChange==='function'){a.onChange.apply(this.outer)}};LinkageSel.prototype._getSelectedArr=function(n){var a=this.st,bindEls=this.bindEls,len=bindEls.length,elm,value,arr=[];if(!len||n>len){return null}n=n-1;if(!n){for(var i=0;i<len;i++){elm=bindEls[i]&&bindEls[i].obj;if(elm&&elm[0]){arr.push(elm.val())}else{arr=null;a.err='_getSelectedArr: !elm';break}}}else{elm=bindEls[i]&&bindEls[i].obj;value=elm&&elm[0]&&elm.val()}a=bindEls=elm=null;return(arr&&arr.length>0)?arr:null};LinkageSel.prototype._getSelectedValue=function(a){var b=this._getSelectedArr(a),len=b.length,value=null,v;if(!b||!len){return null}if(!a){for(var i=0;i<len;i++){v=b[i];if(v||v===0||v==='0'){value=v}else{break}}}else{value=b[a]}return value};LinkageSel.prototype._getSelectedData=function(a,b){var c=this.st,res={},bindEls=this.bindEls,data=this.data[0][c.dataReader.cell],dc,len,pos,valueArr,value;if(b&&isNaN(b)||b<0){return null}valueArr=this._getSelectedArr();data=this.findEntry(data);len=valueArr.length;pos=b==null||b===''?len:b+1;if(!len||!data||pos===null){return null}for(var i=0;i<pos;i++){value=valueArr[i];if(value!==''&&value!=null){if(data[value]){dc=data[value];data=data[value][c.dataReader.cell]}else{dc=null;break}}else if(b>=0){dc=null;break}else{break}}data=null;if(dc===null){res=null}else{for(var x in dc){if(dc.hasOwnProperty(x)&&x!==[c.dataReader.cell]){res[x]=dc[x]}}res=a?res[a]:res}dc=bindEls=valueArr=null;return res};LinkageSel.prototype._getSelectedDataArr=function(a){var b=this.bindEls,len=b.length,data,res=[];if(!len){return null}for(var i=0;i<len;i++){data=this._getSelectedData(a,i);if(data==null){break}res[i]=data}data=b=null;return res};LinkageSel.prototype._changeValues=function(a,b,c){if(c&&typeof c==='object'){var d=c}else{var d=this}var e=d.st,triggerValues=e.triggerValues,bindEls=d.bindEls,len=Math.max(bindEls.length,a.length),v=[],elm;b=b?true:false;if(isNumber(a)||typeof a==='string'){a=[a]}else if(isArray(a)){a=a}else{a=[]}d.resetTrigger(b,a);for(var i=0;i<len;i++){elm=bindEls[i]['obj'];if(elm.val()!==a[i]){elm&&elm.find("option[value='"+a[i]+"']").eq(0).prop('selected',true);break}}elm.change()};LinkageSel.prototype.resetTrigger=function(a,b){var c=this.st;a=a||typeof a==='undefined'?true:false;b=isArray(b)?b:(typeof b==='undefined'?[]:[b]);c.triggerValues=b;c.trigger=a};var isArray=function(v){return Object.prototype.toString.apply(v)==='[object Array]'};var isNumber=function(o){return typeof o==='number'&&isFinite(o)};if(typeof String.prototype.deentityify!=='function'){String.prototype.deentityify=function(){var c={quot:'"','#039':'\'',lt:'<',gt:'>'};return function(){return this.replace(/&([^&;]+);/g,function(a,b){var r=c[b];return typeof r==='string'?r:a})}}()}if(typeof String.prototype.entityify!=='function'){String.prototype.entityify=function(){var a={'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#039;'};return function(){return this.replace(/[<>&"']/g,function(c){return a[c]})}}()}
