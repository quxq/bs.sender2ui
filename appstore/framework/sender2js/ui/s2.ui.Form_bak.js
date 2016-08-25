(function($){
	$.jsImport("s2.ui.TreeView");
	
	/**
	 * 表单UI组件
	 */
	$.fn.extend({
		"s2.ui.Form":function()
		{
			var self = this;
			
			//是否校验，默认不校验
			self.validate = false;
			
			//保存需要校验字段
			var validInputs =  null;
			
			var ds = null;
			var loadDs = null;
			
	
			self.init = function()
			{
				renderForm();
				
				if($.trim(self.attr("s2-url"))){
					self.url = $.trim(self.attr("s2-url"));
				}
				
				if($.trim(self.attr("s2-validate"))){
					self.validate = eval($.trim(self.attr("s2-validate")));
				}
				
				if(self.validate){
					validInputs = self.find("[s2-valid]");
				}
				
				ds = $["sender2.ds"]();
				ds.success = [function(data){
					if(self.submitSuccess){
						self.submitSuccess(data);
					}
				}];
				
				loadDs = $["sender2.ds"]();
				loadDs.success = [function(data){
					self.resetForm();
					
					var obj = null;
					var key = null;
					var val = null;
					
					data.find("row").children().each(function(){
						var col = $(this);
						key = col.context.nodeName; 
				        val = col.text();
						obj = self.find("[name='"+key+"']");
						
						if(obj.is("input") || obj.is("select")){
							
							if(obj.attr("type") == "radio"){
								obj.each(function(){
									if($(this).val() == val){
										$(this).attr("checked","checked").iCheck("check");
									}
								});
							}
							else if(obj.attr("type") == "checkbox"){
								if($.trim(val)){
									var list = val.split(",");
									if(list.length > 0){
										for(var i=0;i<list.length;i++){
											obj.each(function(){
												if($(this).val() == list[i]){
													$(this).attr("checked","checked").iCheck("check");
												}
											});
										}
									}
								}
							}
							else if(obj.attr("type") == "hidden"){
								var combox = self.find("input[s2-name='"+key+"']");
								if(combox.length > 0){
									var comboxComp = combox.data("comp");
									if(eval(combox.attr("s2-isMulitSelect"))){
										comboxComp.render.selectMulit(val.split(","));
									}else{
										comboxComp.render.selectOne(val);
									}
									return;
								}
								
								obj.val(val);
							}
							else{
								obj.val(val);
							}
						}
					});
					
					if(self.loadSuccess){
						self.loadSuccess(data);
					}
				}];
				
				self.submit(function(e){
					  e.preventDefault();
					  self.submitForm();
			     });
			}
			
			/**
			 * 清除tooltip
			 * @param obj
			 * @returns
			 */
			function clearTooltip(obj){
				obj.removeClass("form-error");
				obj.removeData("bs.tooltip");
			}
			
			/**
			 * 显示tooltip
			 * @param obj
			 * @param msg
			 * @returns
			 */
			function setTooltip(obj,msg){
				obj.addClass("form-error");
				obj.tooltip({title:msg,"placement":"right",container: 'body'});
			}
			
			/**
			 * 初始化校验
			 * @returns
			 */
			function initValidate(){
				validInputs.each(function(){
					clearTooltip($(this));	
				});
			}
		   
			/**
			 * 校验
			 * @returns
			 */
			function validate(){
				initValidate();
				
				var bl = true;
				var obj = null;
				var value = null;
				var validStr = null;
				var valids = null;
				var validExpr = null;
				
				
				var remotes = [];
				
				validInputs.each(function(){
					obj = $(this);
					validStr = $.trim(obj.attr("s2-valid"));
					if(validStr){
						if(obj.attr("s2-type") == "combox"){
							value = $.trim(self.find("input[type='hidden'][name='"+obj.attr("s2-name")+"']").val());
						}else{
							value = $.trim(obj.val());
						}
						
						valids = validStr.split(",");
						
						for(var i=0;i<valids.length;i++){
							validExpr = $.trim(valids[i]);
							
							if(validExpr == "empty"){
								if(!$.trim(value)){
									setTooltip(obj,obj.attr("s2-validMsg")+"不能为空")
									bl = false;
									break;
								}
							}
							
							if(validExpr == "badstr"){
								if(!(/^[^\^\\%&\*'\?\/\<\>\|\"`]*$/.test(value))){
									setTooltip(obj,obj.attr("s2-validMsg")+"不能含有特殊字符&gt;&lt;.'?%&amp;")
									bl = false;
									break;
								}
							}
							
							if(validExpr == "number"){
								if(!$.trim(value)){
									break;
								}
								if(!(/^[+-]?[0-9]+.?[0-9]*$/.test(value))){
									setTooltip(obj,obj.attr("s2-validMsg")+"只能是数字")
									bl = false;
									break;
								}
							}
							
							if(/^len:/.test(validExpr)){
								var param = validExpr.split(":")[1].split("_");
								var len = value.length;
								if(len < param[0] || len > param[1]){
									setTooltip(obj,obj.attr("s2-validMsg")+"长度在"+param[0]+"~"+param[1]+"之间")
									bl = false;
									break;
								}
							}
							
							if(/^eq:/.test(validExpr)){
								var controlId = validExpr.split(":")[1];
								var control = self.find(controlId);
								if(value != control.val()){
									setTooltip(obj,control.attr("s2-validMsg")+"不一致");
									bl = false;
									break;
								}
							}
							
							if(/^remote:/.test(validExpr)){
								var url = validExpr.split(":")[1];
								remotes.push({
									url:url,
									obj:obj
								});
							}
						}
					}
				});
				
				if(bl && remotes.length > 0){
					$.each(remotes, function(i, remote){
						var ds = $["sender2.ds"]();
						ds.url = eval(remote.url);
						ds.async = false;
						ds.data = remote.obj.attr("name") + "=" + remote.obj.val();
						ds.success = [function(xml){
							if(xml.find("success").text() == "1"){
								setTooltip(remote.obj, remote.obj.val()+"已经存在");
								bl = false;
							}
						}];
						ds.load();
					});
				}
				
				return bl;
			}
			
			/**
			 * 渲染form表单
			 * @returns
			 */
			function renderForm()
			{
				self.find("input[s2-type='combox']").each(function(){
					var obj = $(this);
					
					obj.attr("readonly","readonly");
					
					var render = obj.attr("s2-render");
					var isMulit = eval(obj.attr("s2-isMulitSelect"));
					var s2Name = obj.attr("s2-name");
					
					var box = obj["sender2.ui.s2type.combox"]();
					box.renderType = render;
					box.isMulit = isMulit;
					box.name = s2Name;
					box.init();
				});
				
				self.find('input[type="checkbox"],input[type="radio"]').iCheck({
				    checkboxClass: 'icheckbox_flat-blue',
				    radioClass: 'iradio_flat-blue'
				});
			}
			
			function parseFormData()
			{
				  var formdata = {};
				  
				  var names = [];
				  
				  self.find('input[type="checkbox"][name]').each(function(){
				      names.push($(this).attr("name"));
				  });
				  
				  $.unique(names);
				  
				  $.each(names, function(i, name){
					  var val = '';
					  self.find('input[type="checkbox"][name="'+name+'"]').each(function(){
						  if($(this).is(":checked")){
							val += $(this).val() + ",";  
						  }
					  });
					  if(val.length > 0){
						  val = val.substring(0,val.length - 1);
					  }
					  formdata[name] = val;
				  });
				  
				  self.find('input[type!="checkbox"][name],select[name]').each(function(){
					  formdata[$(this).attr("name")] = $(this).val();
				  });
				  
				  return formdata;
			}
			
			/**
			 * 提交表单
			 */
			self.submitForm = function()
			{
				if(self.submitBefore){
					self.submitBefore();
				}
				  
				if(!$.trim(self.url)){
					alert("请设置s2.ui.Form的url属性");
					return;
				}
					  
	    		if(self.validate && !validate()){
	    			return;
		    	}
	    		  
	    		ds.url = self.url;
	    		ds.data = parseFormData();
	    		ds.load();
			}
			
			/**
			 * 重置表单
			 */
			self.resetForm = function()
			{
				initValidate();
				
				self.get(0).reset();
				
				self.find('input[type="hidden"]').val('');
				self.find('input[type="checkbox"],input[type="radio"]').attr("checked","").iCheck("uncheck");
				self.find("ul.s2ui-combox li.list-group-item").removeClass("active");
				
				self.find("input[s2-type='combox']").each(function(){
					var comp = $(this).data("comp");
					if(comp.attr("s2-render") == "tree"){
						comp.render.reset();
					}
					$(this).val(comp.render.defaultLabel);
				});
			}
			
			/**
			 * 校验表单
			 */
			self.validateForm = function()
			{
				return validate();
			}
			
			/**
			 * 加载表单
			 */
			self.load = function(url, param)
			{
				if(param){
					loadDs.data = param;
				}
				if(url){
					loadDs.url = url;
					loadDs.load();
				}else{
					alert("请设置url参数");
				}
			}
			
			self.data("comp", self);
			
			return self;
		}
	});
	
	/**
	 * 下拉框
	 */
	$.fn.extend({
		"sender2.ui.s2type.combox" : function()
		{
			var self = this;
			
			var hidden;
			var box;
			
			self.init = function()
			{
				createUi();
				
				self.parent(".form-group")
					.addClass("has-feedback")
					.end()
					.after('<span class="glyphicon glyphicon-triangle-bottom form-control-feedback" aria-hidden="true"></span>');
				
				self.on("click",function(e){
					
					var winHeight = $(window).height();
					var offsetTop = self.get(0).getBoundingClientRect().top;
					var top = box.height() - self.height() - 3;
					var height = winHeight - offsetTop - self.height();
					
					if(offsetTop > (winHeight / 2) && height < box.height()){
						box.css({top:"-"+top+"px",width:self.outerWidth() + "px","position": "absolute"});
					}
					
					var comboxs = $("body").find(".s2ui-combox");
					comboxs.removeClass("current");
					
					var obj = self.nextAll("div[class='s2ui-combox']:first");
					obj.addClass("current");
					
					comboxs.each(function(){
						if(!$(this).hasClass("current")){
							$(this).hide();
						}
					});
					
					obj.toggle();
					e.stopPropagation();
				});
			}
			
			/**
			 * 关闭下拉框
			 */
			self.close = function()
			{
				self.nextAll("div[class*='s2ui-combox']:first").hide();
			}
			
			/**
			 * 设置下拉框值
			 */
			self.setValue = function(val)
			{
				hidden.val(val);
			}
			
			/**
			 * 设置下拉框显示值
			 */
			self.setLabel = function(val)
			{
				self.val(val || self.render.defaultLabel);
			}
			
			function createUi()
			{
				var _width = self.outerWidth();
				box = $('<div class="s2ui-combox">暂无数据</div>');
				box.css({width:_width + "px","position": "absolute"});
				self.after(box);
				
				hidden = $('<input type="hidden" name="'+self.name+'">');
				box.after(hidden);
				box.click(function(e){
					e.stopPropagation();
				});
				
				if(self.renderType == "list")
				{
					self.render = box["s2.ui.s2render.list"]();
					self.render.combox = self;
					self.render.init();
				}
				else if(self.renderType == "tree")
				{
					self.render = box["s2.ui.s2render.tree"]();
					self.render.combox = self;
					self.render.init();
				}
				
				if(self.render.defaultLabel){
					self.setValue('')
					self.setLabel(self.render.defaultLabel);
				}
				
				$(window).resize(function(){
					var _width = self.outerWidth();
			        box.css({ width:_width + "px","position": "absolute"});
				});
				
				$("body").click(function(){
					$("body").find(".s2ui-combox").hide();
				});
			}
			
			self.data("comp", self);
			
			return self;
		}
	});
	
	/**
	 * combox下拉列表渲染器
	 */
	$.fn.extend({
		"s2.ui.s2render.list" : function()
		{
			var self = this;
			
			var container = null;
			
			self.defaultLabel = "暂无";
			self.mapcol = {id:"id",name:"name"};
			
			self.init = function()
			{
				container = self.find("ul.list-group");
				if(container.length == 0){
					self.html('<ul class="list-group" style="margin-bottom:0;"></ul>');
					container = self.find("ul.list-group");
				}
			}
			
			/**
			 * 设置combox多选后的值
			 * @returns
			 */
			function setComboxMulitSelectValue()
			{
				var val = '';
				var label = '';
				
				container.find('li input[type="checkbox"]:checked').each(function(){
					var row = $(this).parents("li").data("row")
					val += row[self.mapcol.id] + ",";
					label += row[self.mapcol.name] + ",";
				});
				
				if(val.length > 0){
					val = val.substring(0,val.length - 1);
				}
				
				if(label.length > 0){
					label = label.substring(0,label.length - 1);
				}
				
				self.combox.setLabel(label);
				self.combox.setValue(val);
			}
			
			/**
			 * 添加item
			 */
			self.addItem = function(data)
			{
				var checkbox = '';
				
				if(self.combox.isMulit){
					checkbox = '<input type="checkbox"> ';
				}
				
				var item = $('<li class="list-group-item" id="' + data[self.mapcol.id] + '"><label>' + checkbox + data[self.mapcol.name] + '</label></li>');
				item.data("row", data);
				item.click(function(){
					if(self.combox.isMulit){
						$(this).find('input[type="checkbox"]').iCheck('toggle');
						setComboxMulitSelectValue();
					}else{
						self.selectOne($(this).data("row")[self.mapcol.id]);
						self.combox.close();
					}
				});
				
				var cbx = item.find('input[type="checkbox"]');
				
				if(cbx.length > 0){
					cbx.iCheck({
					    checkboxClass: 'icheckbox_flat-blue',
					    radioClass: 'iradio_flat-blue'
					});
					
					cbx.on('ifChecked', function(){
						setComboxMulitSelectValue();
					});
					
					cbx.on('ifUnchecked', function(){
						setComboxMulitSelectValue();
					});
				}
				
				container.append(item);
			}
			
			/**
			 * 单选
			 */
			self.selectOne = function(id)
			{
				container.find(".list-group-item").removeClass("active");
				var item = container.find("#"+id);
				
				item.addClass("active");
				
				if(self.combox && !self.combox.isMulit){
					self.combox.setValue(item.data("row")[self.mapcol.id]);
					self.combox.setLabel(item.data("row")[self.mapcol.name]);
				}
			}
			
			/**
			 * 多选
			 */
			self.selectMulit = function(ids)
			{
				container.find('input[type="checkbox"]').iCheck('uncheck');
				
				var val = '';
				var label = '';
				var cbx = null;
				
				for(var i=0; i<ids.length; i++){
					cbx = container.find("#"+ids[i]).find('input[type="checkbox"]');
					
					if(cbx.length > 0){
						cbx.iCheck('check');
						val += cbx.parents("li").data("row")[self.mapcol.id] + ",";
						label += cbx.parents("li").data("row")[self.mapcol.name] + ",";
					}
				}
				
				if(val.length > 0){
					val = val.substring(0,val.length - 1);
				}
				
				if(label.length > 0)
				{
					label = label.substring(0,label.length - 1);
				}
				
				if(self.combox && self.combox.isMulit){
					self.combox.setValue(val);
					self.combox.setLabel(label);
				}
			}
			
			return self;
		}
	});
	
	/**
	 * combox下拉树渲染器
	 */
	$.fn.extend({
		"s2.ui.s2render.tree" : function()
		{
			var self = this;
			var self = this;
			var tree;
			
			self.defaultLabel = "暂无";
			self.mapcol = {id:"id", pid:"pid", name:"name"};
			
			self.init = function()
			{
				var tb = self.find("table");
				if(tb.length == 0){
					self.html('<table class="table table-hover"></table>');
					tb = self.find("table");
				}
				
				tree = tb["s2.ui.TreeView"]();
				tree.autoLoad = false;
				tree.init();
				
				tree.mapcol = self.mapcol;
				tree.checkbox = self.combox.isMulit;
				tree.doClickAfter = function(row){
					setComboxOneLabelAndValue(row);
					self.combox.close();
				}
				tree.doSelectAfter = function(){
					setComboxMulitLabelAndValue();
				}
			}
			
			self.reset = function(){
				if(tree.checkbox){
					tree.unselectAll();
				}else{
					tree.clearSelectedRow();
				}
			}
			
			self.setData = function(data)
			{
				tree.setData(data);
				tree.create();
			}
			
			/**
			 * 选中单个节点
			 */
			self.selectOne = function(id)
			{
				var row = tree.selectRow(id);
				setComboxOneLabelAndValue(row);
			}
			
			/**
			 * 选中多个节点
			 */
			self.selectMulit = function(ids)
			{
				tree.checkRows(ids);
				setComboxMulitLabelAndValue();
			}
			
			function setComboxOneLabelAndValue(row)
			{
				self.combox.setLabel(row[self.mapcol.name]);
				self.combox.setValue(row[self.mapcol.id]);
			}
			
			function setComboxMulitLabelAndValue()
			{
				var val = '';
				var label = '';
				var rows = tree.getCheckedRows(true);
				
				if(rows){
					var row;
					
					for(var i=0;i<rows.length;i++){
						row = rows[i];
						
						val += row[self.mapcol.id] + ",";
						label += row[self.mapcol.name] + ",";
					}
					
					if(val.length > 0){
						val = val.substring(0,val.length - 1);
					}
					
					if(label.length > 0){
						label = label.substring(0,label.length - 1);
					}
				}
				
				self.combox.setLabel(label);
				self.combox.setValue(val);
			}
			
			return self;
		}
	});
})(jQuery);