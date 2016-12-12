
var token = $.ROOT.getItem("token");
$(function () {
	getBrandList();
	// 栏目树展开/合并
	$(".ul-tree").on("click", '.cell-item .fa', function () {
		var minus = $(this).hasClass("fa-minus-square-o");
		var plus = $(this).hasClass("fa-plus-square-o");
		if(minus) {
			$(this).addClass("fa-plus-square-o").removeClass("fa-minus-square-o");
			$(this).parent().parent().parent().siblings("ul").hide();
		} else if(plus) {
			$(this).addClass("fa-minus-square-o").removeClass("fa-plus-square-o");
			$(this).parent().parent().parent().siblings("ul").show();
		}
	});

	// 编辑
	$(".ul-tree").on("click", ".edit", function () {
		var _this = $(this);
		var nameObj = $(this).parent().siblings("div").find("input[name='name']");
		var txt = nameObj.val();
		if($(this).hasClass("disable")){
			nameObj.val("").focus();
			return false;
		}
		$(this).addClass("disable");
		nameObj.siblings(".add-child-node").hide();
		nameObj.attr("readonly", false);
		nameObj.after("<a href='javascript:;' class='submit'><i class='fa fa-check-circle'></i></a><a href='javascript:;' class='cancel'><i class='fa fa-times-circle'></i></a>");
		nameObj.val("").focus().val(txt);
		nameObj.siblings(".cancel").on("click", function () {
			$(this).siblings("input[name='name']").val(txt).attr("readonly", true);
			$(this).siblings(".submit").remove();
			$(this).siblings("i.fa").show();
			$(this).remove();
			_this.removeClass("disable");
		});
	});

	// 排序
	$(".sort").click(function () {
		var param = {token: $.ROOT.getItem("token")};
		var cateSort = [];
		$("#treeBox").find("input[name='sort']").each(function () {
			var str = $(this).data("id")+'|'+$(this).val();
			cateSort.push(str);
		});
		cate_sort = cateSort.join(",");
		param["cate_sort"] = cate_sort;
		var load = layer.load(1, {
			shade: [0.5,'#000']
		});
		$.ROOT.request("Category/sort", param, function (data) {
			layer.close(load);
			if(data.status == 1){
				layer.msg(data.msg);
				setTimeout(function () {
					getBrandList();
				}, 800);
			} else {
				layer.alert(data.msg);
				return false;
			}
		});
	});


	// 添加同级节点
	$(".ul-tree").on("click", ".add-node", function () {
		var index = $(this).data("index");
		var pid = $(this).data("pid");
		var li = $(this).parent().parent().parent();
		var html = createHtml(index-1, pid);
		li.before(html);
		li.prev().find('input[name="name"]').focus();
		li.prev().on("click", ".cancel", function () {
			$(this).parents(".new-node").remove();
		});
	});

	// 添加子级节点
	$(".ul-tree").on("click", ".add-child-node", function () {
		var index = $(this).data("index");
		var _this = $(this);
		var id = _this.siblings("input[name='cate_id']").val();
		var row = _this.parent().parent().parent();
		var html = createHtml(index, id);
		var operate = _this.parent().parent().siblings(".operate").html();
		var artListObj = operate.split("|")[0];
		var editObj = operate.split("|")[1];
		_this.parent().parent().siblings(".operate").html(artListObj+' | '+editObj);
		row.after('<ul class="ul-tree'+(index+1)+'">'+html+'</ul>');
		_this.remove();
		row.parent().on("click", ".new-node .cancel", function () {
			$(this).parents(".new-node").parent().prev().find("input[name='name']").after(' <a href="javascript:;" class="add-child-node" data-index="'+index+'" title="添加子栏目"><i class="fa fa-plus-square"></i></a>');
			$(this).parents(".new-node").parent().prev().find(".operate").html(operate);
			$(this).parents(".new-node").parent().remove();
		});
	});

	// 提交数据
	$(document).on("click", ".ul-tree .submit", function () {
		var _this = $(this);
		var id = _this.siblings('input[name="cate_id"]').val() || -1;
		var title = _this.siblings('input[name="name"]').val();
		var pid = _this.siblings('input[name="pid"]').val();
		var index = _this.data("index") || 0;
		var sort = _this.parent().parent().find("input[name='sort']").val();
		if(title == ""){
			layer.alert("栏目名称不能为空！");
			return false;
		}
		if(id == -1){
			// 添加节点
			var param = {token: token, pid: pid, sort: sort, title: title};
			var load = layer.load(1, {
				shade: [0.5,'#000']
			});
			$.ROOT.request("Category/add", param, function (data) {
				if(data.status == 1){
					layer.close(load);
					layer.msg(data.msg);
					_this.siblings('input[name="name"]').attr("readonly", true);
					_this.siblings('input[name="cate_id"]').val(data.cate_id);
					_this.parent().parent().parent().parent().removeClass("new-node");
					if(!(_this.parent().parent().parent().parent().siblings(".add-node-box").length)){
						var html = createAddSiblingsHtml(index+1, pid);
						_this.parent().parent().parent().parent().after(html);
					}
					_this.siblings(".cancel").remove();
					_this.parent().parent().siblings(".operate").removeClass("hidden").find(".delete").attr("data-id", data.cate_id).attr("data-index", index+1);
					_this.parent().parent().siblings(".operate").find(".J_menuItem").attr("href", _this.parent().parent().siblings(".operate").find(".J_menuItem").attr("href")+'?cate_id='+data.cate_id);
					_this.replaceWith(' <a href="javascript:;" class="add-child-node" data-index="'+(index+1)+'" title="添加子栏目"><i class="fa fa-plus-square"></i></a>');
				} else {
					layer.close(load);
					layer.alert(data.msg);
				}
			});
		} else {
			// 编辑节点
			var param = {token: token, cate_id: id, pid: pid, sort: sort, title: title};
			var load = layer.load(1, {
				shade: [0.5,'#000']
			});
			$.ROOT.request("Category/add", param, function (data) {
				if(data.status == 1){
					layer.close(load);
					layer.msg(data.msg);
					_this.siblings("input[name='name']").attr("readonly", true);
					_this.siblings(".cancel").remove();
					_this.siblings(".add-child-node").show();
					_this.parent().parent().siblings(".operate").find(".edit").removeClass("disable");
					_this.remove();
				} else {
					layer.close(load);
					layer.alert(data.msg);
				}
			});
		}
	});

	// 删除节点
	$(".ul-tree").on("click", " .delete", function () {
		var id = $(this).data("id");
		var li = $(this).parent().parent().parent();
		var index = $(this).data("index");
		layer.confirm('确定要删除该栏目？', {
			btn: ['确定','取消'] //按钮
		}, function(){
			// 提交异步请求
			var load = layer.load(1, {
				shade: [0.5,'#000']
			});
			var param = {token: token, cate_id: id}
			$.ROOT.request("Category/delete", param, function (data) {
				if(data.status == 1){
					layer.close(load);
					layer.msg(data.msg);
					if(li.parent().find(">li").length <= 2){
						li.parent().prev().find("input[name='name']").after(' <a href="javascript:;" class="add-child-node" data-index="'+(index-1)+'" title="添加子栏目"><i class="fa fa-plus-square"></i></a>');
						var id = li.parent().prev().find("input[name='cate_id']").val();
						li.parent().prev().find(".edit").after(' | <a href="javascript:;" class="delete" data-id="'+id+'" data-index="'+(index-1)+'">删除</a>');
						li.parent().remove();
					} else { 
						li.remove();
					}
				} else {
					layer.close(load);
					layer.alert(data.msg);
				}
			});
		}, function(){
			
		});
	});
});

function getBrandList() {
	var param = {token: $.ROOT.getItem("token")}
	$.ROOT.request("Category/index", param, function (data) {
		if(data.status == 1){
			var html = insetHtml(0, data.list);
			$("#treeBox").html(html);
		} else {
			layer.alert(data.msg);
			return false;
		}
	});
}

function insetHtml (index,data) {
	var html = "";
	for(var i = 0, len = data.length; i < len; i++){
		html += '<li>';
		html +=  createInsetHtml(index,data[i]);
		if(data[i].list.length > 0){
			html += '<ul style="display:none;" class="ul-tree'+(index+2)+'">';
			html += insetHtml(index+1, data[i].list);
			html +='</ul>';
		}
		html += '</li>';
	}

	if(data.length > 0){
		html += createAddSiblingsHtml(index+1, data[0].pid);
	} else {
		if(index == 0){
			html += createAddSiblingsHtml(index+1, 0);
		}
	}

	return html;
}

function createHtml (index, pid) {
	var tabHtml = getTabHtml(index);
	var html = '<li class="new-node">';
	html += '<div class="row">';
	html += '<div class="col-md-10">';
	html += '<div class="ul-tree-item cell-item"><input type="text" name="sort" value="0" class="sort txt"></div>';
	html += tabHtml;
	html += '<div class="ul-tree-item cell-item"></div><div class="ul-tree-item cell-item"></div>';
	if(index == 0)
		html += '';
	else 
		html += '<div class="ul-tree-item cell-item icon icon-node"></div>';
	html += '<div class="ul-tree-item"><input type="text" value="" name="name" class="txt"><input type="hidden" value="'+pid+'" name="pid"><input type="hidden" value="" name="cate_id"><a href="javascript:;" class="submit" data-index="'+index+'"><i class="fa fa-check-circle"></i></a><a href="javascript:;" class="cancel"><i class="fa fa-times-circle"></i></a></div>';
	html += '</div>';
	html += '<div class="col-md-2 operate hidden">';
	html += '<a href="/html-article-list.html" class="J_menuItem">资讯列表</a> | <a href="javascript:;" class="edit">编辑</a> | <a href="javascript:;" class="delete">删除</a>';
	html += '</div>';
	html += '</div>';
	html += '</li>';
	return html;
}

function createInsetHtml (index, data) {
	var hasList = data.list.length>0?1:0;
	var tabHtml = getTabHtml(index);
	var html = '';
	html += '<div class="row">';
	html += '<div class="col-md-10">';
	html += '<div class="ul-tree-item cell-item"><input type="text" name="sort" value="'+data.sort+'" class="sort txt" data-id="'+data.cate_id+'"></div>';
	html += tabHtml;
	if(hasList)
		html += '<div class="ul-tree-item cell-item"><i class="fa fa-plus-square-o"></i></div>';
	else
		html += '<div class="ul-tree-item cell-item"></div>';
	html += '<div class="ul-tree-item cell-item"></div>';
	if(index == 0)
		html += '';
	else 
		html += '<div class="ul-tree-item cell-item icon icon-node"></div>';
	html += '<div class="ul-tree-item">';
	html += '<input type="text" value="'+data.title+'" name="name" class="txt" readonly>';
	html += '<input type="hidden" value="'+data.pid+'" name="pid">';
	html += '<input type="hidden" value="'+data.cate_id+'" name="cate_id">';
	if(!hasList){
		html += ' <a href="javascript:;" class="add-child-node" data-index="'+(index+1)+'" title="添加子栏目"><i class="fa fa-plus-square"></i></a>';
	}
	html += '</div>';
	html += '</div>';
	html += '<div class="col-md-2 operate">';
	html += '<a href="/html-article-list.html?cate_id='+data.cate_id+'" class="J_menuItem">资讯列表</a>';
	html += ' | <a href="javascript:;" class="edit">编辑</a>';
	if(!hasList)
		html += ' | <a href="javascript:;" class="delete" data-id="'+data.cate_id+'" data-index="'+(index+1)+'">删除</a>';
	html += '</div>';
	html += '</div>';
	return html;
}

function getTabHtml (index) {
	var html = '';
	for(var i = 0; i < index; i++){
		html += '<div class="ul-tree-item cell-item"></div>';
	}
	return html;
}

function createAddSiblingsHtml(index, pid) {
	var tabHtml = getTabHtml(index+2);
	var html = '<li class="add-node-box">';
	html += '<div class="row">';
	html += '<div class="col-md-10">';
	html += '<div class="ul-tree-item cell-item"></div>';
	html += tabHtml;
	html += '<div class="ul-tree-item cell-item icon icon-last-node"></div>';
	html += '<a href="javascript:;" data-index="'+index+'" class="add-node" data-pid="'+pid+'"><i class="fa fa-plus-square"></i>添加'+numToHan(index)+'级栏目</a>';
	html += '</div>';
	html += '</div>';
	html += '</li>';
	return html;
}

function numToHan (i) {
	var html = "";
	switch(i){
		case 1: html = '一'; break;
		case 2: html = '二'; break;
		case 3: html = '三'; break;
		case 4: html = '四'; break;
		case 5: html = '五'; break;
		case 6: html = '六'; break;
		case 7: html = '七'; break;
		case 8: html = '八'; break;
		case 9: html = '九'; break;
	}
	return html;
}