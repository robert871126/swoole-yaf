var id = $.getQueryString("id");
var api = '';


api = 'Content/add';
getBrandList();


$(function () {

	var sessionexpire = null;
	clearInterval(sessionexpire);
	sessionexpire = setInterval(function () {
		var param = {token: $.ROOT.getItem("token")}
		$.ROOT.request("Content/sessionexpire", param, function (data) {

		});
	}, 600000);

	var ue = UE.getEditor('editBox'); // Ueditor 编辑器

	var _parent = $(window.parent.document);
	var textArea = $("textarea[name='desc']");
	var tips = textArea.siblings("span");
	$.textAreaStatInputNum(textArea, tips);

	$(".ibox").on("click", "input[name='isjump']", function () {
		var isCheck = $(this).prop("checked");
		if(isCheck){
			$(".jump-url").show();
			$(".art-content").hide();
		} else {
			$(".jump-url").hide();
			$(".art-content").show();
		}
	});

	$("#save").click(function () {
		
		if($("input[name='title']").val()==''){
			layer.alert('标题不能为空');
			return false;
		}
		if($("input[name='image']").val()==''){
			layer.alert('封面图片不能为空');
			return false;
		}
		if($("textarea[name='desc']").val()==''){
			layer.alert('资讯摘要不能为空');
			return false;
		}

		var param = {
			token: $.ROOT.getItem("token"),
			title: $("input[name='title']").val(),
			is_push:$("input[name='is_push']:checked").val(),
			user_type: $("input[name='send-object']:checked").val(),
			firsttitle: $("input[name='firsttitle']").prop("checked")?1:0,
			istop: $("input[name='istop']").prop("checked")?1:0,
			isimg: $("input[name='isimg']").prop("checked")?1:0,
			isslide: $("input[name='isslide']").prop("checked")?1:0,
			isgood: $("input[name='isgood']").prop("checked")?1:0,
			isscroll: $("input[name='isscroll']").prop("checked")?1:0,
			isjump: $("input[name='isjump']").prop("checked")?1:0,
			tags: $("input[name='tags']").val(),
			sort: $("input[name='weight']").val(),
			bg_img: $("input[name='image']").val(),
			cate_id: $("input[name='cate_id']").val(),
			befrom: $("input[name='from']").val(),
			writer: $("input[name='author']").val(),
			keyword: $("input[name='keywords']").val(),
			desc: $("textarea[name='desc']").val()
		}

		if($("input[name='isjump']").prop("checked")){
			if($(".jump-url").find("input").val()==''){
				layer.alert('跳转链接不能为空');
				return false;
			}
			param['jump_url']=$(".jump-url").find("input").val();
		} else {
			var content = ue.getContent() || '';
			if(content==''){
				layer.alert('资讯内容不能为空');
				return false;
			}
			param['content']=content;
		}
		if(id){
			param["info_id"] = id;
		}
		var loading = layer.load(1, {
			shade: [0.5,'#000']
		});
		$.ROOT.request(api, param, function (data) {
			layer.close(loading);
			if(data.status == 1){
				var i = layer.confirm("添加成功！", {
					btn: ['返回列表','继续添加'] //按钮
				}, function(){
					var _thisObj = _parent.find(".J_menuTab.active");
					var _thisIframe = _parent.find("iframe:visible");
					_thisObj.hide();
					_thisIframe.hide();
					_parent.find(".J_menuTabs").find(".J_menuTab").each(function () {
						var t = $(this).data("id");
						if(t == '/html-article-list.html'){
							$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
						}
					});
					_parent.find(".J_mainContent").find("iframe").each(function () {
						var src = $(this).attr("src");
						if(src == '/html-article-list.html'){
							var id = $(this).attr("id");
							_parent.find("#"+id)[0].contentWindow.setParam(); 
							$(this).show().siblings("iframe").hide();
							return false;
						}
					});
					_thisObj.remove();
					_thisIframe.remove();
				}, function(){
					window.location.reload();
				});
			} else {
				layer.alert(data.msg);
			}
		});
	});

	$("#reload").click(function () {
		window.location.reload();
	});
	
	$("body").on("click", "#buttonUpload", function(){
		var _this = $(this);
		var loading = layer.load(1, {
			shade: [0.5,'#000'] //0.1透明度的白色背景
		});
		$.uploads("Common/upload", 'fileToUpload', {}, function (data) {
			layer.close(loading);
			if(data.status == 1){
				_this.parent().find("input[name='image']").val(data.url);
				if(_this.parents(".file_box").next().find("img").length)
					_this.parents(".file_box").next().find("img").attr('src', data.url).css({"max-height": "200px;"});
				else
		        	_this.parents(".file_box").after('<div style="padding: 20px 0;"><img src="'+data.url+'" alt="" style="max-height: 200px;"/></div>');
			} else {
				layer.alert(data.msg);
				return false;
			}
		});
	});
});


function changeVal(obj){
	var src =$(obj).prop("files");
	$(obj).parent().siblings("input[type='text']").val(src[0].name);
}


function getBrandList () {
	var param = {token: $.ROOT.getItem("token")}
	$.ROOT.request("Category/index", param, function (data) {
		if(data.status == 1) {
			var newData = dataToSelectData(data.list);
			var opts = {
		        data: newData,
		        head: false,
		        selStyle: 'margin-left: 3px;',
		        select: '#brandLinkSelect',
		        selClass: 'form-control'
		    };
		    var linkageSel = new LinkageSel(opts);
			
		    linkageSel.onChange(function(){
		        var v = this.getSelectedValue();
		        $("input[name='cate_id']").val(v);
		    });
		}
	});
}

function dataToSelectData(data) {
	var newData = {};
	for(var i = 0; i < data.length; i++){
		newData[data[i].cate_id] = {
			name: data[i].title
		};
		if(data[i].list.length > 0)
			newData[data[i].cate_id].cell = dataToSelectData(data[i].list)
	}
	return newData;
}