(function($){
	/**
	 * 数据表格UI组件
	 */
	$.fn.extend({
		"s2.ui.SimpleDataGrid" : function()
		{
			//checkbox选中图标
			var CBX_CHECKED_CLS = "cbx-checked fa fa-check-square-o";
			//checkbox未选中图标
			var CBX_UN_CHECKED_CLS = "cbx-unchecked fa fa-square-o";
			
			var self = this;
			
			var ds = null;
			var thead = null;
			var tbody = null;
			var thButton = null;
			var thCheckBox = null;
			var bodyCheckBoxs = null;
			var form = null;
			var columns = null;
			var workerBtnConf = {};
			var rowMapForId = {};
			
			//是否显示复选框
			self.checkbox = false;
			//是否分页，默认不分页
			self.pagination = false;
			//id字段名称
			self.idField = "id";
			//是否默认加载
			self.autoLoad = true;
			
			/**
			 * 初始化
			 */
			self.init = function()
			{
				initConf();
				
				createHeadView();
				
				ds = $["sender2.ds"]();
				ds.url = self.url;
				ds.success = [function(data){
					//创建标头
					createBodyView(data);
					
					if(self.loadSuccess){
						self.loadSuccess(data);
					}
					
				}];
				
				if(self.pagination){
					return;
				}
				
				if(self.autoLoad){
					self.load();
				}
			}
			
			/**
			 * 获取数据源
			 */
			self.getDs = function()
			{
				return ds;
			}
			
			/**
			 * 选中所有节点
			 */
			self.selectAll = function()
			{
				select(CBX_CHECKED_CLS, 'check', 'checked');
			}
			
			/**
			 * 取消选中所有节点
			 */
			self.unselectAll = function()
			{
				select(CBX_UN_CHECKED_CLS, 'uncheck', 'unchecked');
			}
			
			/**
			 * 获取选中的节点数据
			 * @param isHalf 是否包含半选节点
			 */
			self.getCheckedRows = function()
			{
				var rows = [];
				var count = 0;
				
				$.each(rowMapForId, function(i, row){
					if(row.cbx_state == "checked"){
						rows.push(row);
						count++;
					}
				});
				
				if(count == 0){
					return null;
				}
				
				return rows;
			}
			
			/**
			 * 添加按钮和回调方法
			 */
			self.addWorkerButton = function(btnKey, btnName, callback)
			{
				workerBtnConf[btnKey] = {btnKey:btnKey, btnName:btnName, callback:callback};
			}
			
			
			/**
			 * 加载数据
			 */
			self.load = function(params)
			{
				
				var data = '';
				
				if(self.form){
					data += self.form.serialize();
				}
				
				if(params){
					if($.type(params) == 'string'){
						data += '&' + params;
					}else{
						data += '&' + $.param(params);
					}
				}
				
				ds.data = data;
				ds.load();
			}
			
			function select(checkCls, checkMethod, checkState)
			{
				if(self.checkbox){
					thCheckBox.attr('class', checkCls);
					
					if(bodyCheckBoxs){
						bodyCheckBoxs.iCheck(checkMethod);
						
						$.each(rowMapForId, function(i, row){
							row.cbx_state = checkState;
						});
					}
				}
			}
			
			function initConf()
			{
				if($.trim(self.attr("s2-url"))){
					self.url = self.attr("s2-url");
				}
				
				if($.trim(self.attr("s2-checkbox"))){
					self.checkbox = self.attr("s2-checkbox");
				}
				
				if($.trim(self.attr("s2-idField"))){
					self.idField = self.attr("s2-idField");
				}
				
				if($.trim(self.attr("s2-form"))){
					self.form = $($.trim(self.attr("s2-form")));
				}
				
				if($.trim(self.attr("s2-pagination"))){
					self.pagination = eval($.trim(self.attr("s2-pagination")));
				}
				
				if($.trim(self.attr("s2-autoLoad"))){
					self.autoLoad = eval($.trim(self.attr("s2-autoLoad")));
				}
				
				if($.trim(self.attr("s2-columns"))){
					self.columns = eval(self.attr("s2-columns"));
				}
			}
			
			/**
			 * 创建表头
			 * @returns
			 */
			function createHeadView()
			{
				self.addClass('table table-bordered table-hover')
					.append('<thead><tr></tr></thead><tbody></tbody>');
				
				thead = self.find("thead");
				tbody = self.find("tbody");
				
				var tr = thead.find("tr");
				
				if(self.checkbox){
					tr.append('<th style="background:#fff;" width="42"><button type="button" class="btn btn-default btn-xs"><i class="' + CBX_UN_CHECKED_CLS + '" style="width:13px;"></i></button></th>');
					thButton = thead.find('th:first').find('button');
					thCheckBox = thButton.find('i');
					
					thButton.on('click', function(){
						if(thCheckBox.hasClass("cbx-unchecked")){
							self.selectAll();
						}else{
							self.unselectAll();
						}
					});
				}
				
				$.each(self.columns, function(i, c){
					if(c.width){
						tr.append('<th width="' + c.width + 'px">' + c.title + '</th>');
					}else{
						tr.append('<th>' + c.title + '</th>');
					}
				});
			}
			
			/**
			 * 创建表体
			 * @param data
			 * @returns
			 */
			function createBodyView(data)
			{
				if(thCheckBox){
					thCheckBox.attr("class", CBX_UN_CHECKED_CLS);
				}
				
				var rows = data.find("row");
				
				if(rows.length < 1){
					showNoData();
					return;
				}
				
				//清空表格
				tbody.empty();
				
				var tr = null;
				var id = null;
				var rowJson = null;
				var value = null;
				
				$.each(rows, function(i, row){
					id = $(row).find(self.idField).text();
					
					//将xml数据格式转换成json数据格式
                    rowJson = $.toJson($(row));
                    rowJson.cbx_state = "unchecked";
                    rowMapForId[id] = rowJson;
                    
					tr = '<tr s2-id="' + id + '">';
					
					if(self.checkbox){
						tr += '<td><input type="checkbox"></td>';
					}
					
					$.each(self.columns, function(i, c){
						if(c.field == 'worker'){
							
							if(!$.isEmptyObject(workerBtnConf)){
								
								var index = 0;
								
								for(var k in workerBtnConf){
									
									if(index == 0){
										value = '<div class="btn-group">'
											+ '<button type="button" class="btn btn-default btn-xs" s2-btnKey="' + k + '">' + workerBtnConf[k].btnName + '</button>'
											+ '<button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'
											+ '<span class="caret"></span>'
											+ '<span class="sr-only">Toggle Dropdown</span>'
											+ '</button>'
											+ '<ul class="dropdown-menu" role="menu">';
										index = 1;
									}
									value += '<li><a href="javascript:void(0);" s2-btnKey="' + k + '">' + workerBtnConf[k].btnName + '</a></li>';
								}
								
								value +='</ul></div>';
							}else{
								value = '--';
							}
							
							
						}else{
							if(self.render){
								value = self.render(c.field, rowJson);
							}else{
								value = rowJson[c.field];
							}
							
							if(!$.trim(value)){
								value = "--";
							}
						}
						
						tr += '<td>' + value + '</td>';
						
						
					});
					
					tr += '</tr>';
					
					tr = $(tr);
					
					//添加行
					tbody.append(tr);
					
					//注册worker方法
					for(var k in workerBtnConf){
						
						tr.find('[s2-btnKey="' + k + '"]').click(function(e) {
							var s2_id = $(this).parents("tr").attr("s2-id");
							workerBtnConf[$(this).attr("s2-btnKey")].callback(rowMapForId[s2_id]);
						});
					}
				});
				
				if(self.checkbox){
					renderCheckBox();
				}
			}
			
			function renderCheckBox()
			{
				bodyCheckBoxs = tbody.find('tr').find('td:first').find('input[type="checkbox"]');
				
				bodyCheckBoxs.iCheck({
					  checkboxClass: 'icheckbox_flat-blue',
					  radioClass: 'iradio_flat-blue'
				});
				
				bodyCheckBoxs.on('ifClicked', function(){
					var id = $(this).parents('tr').attr("s2-id");
					if($(this).is(':checked')){
						thCheckBox.attr('class', CBX_UN_CHECKED_CLS);
						rowMapForId[id].cbx_state = "unchecked";
					}else{
						var unchecked_count = 0;
						
						rowMapForId[id].cbx_state = "checked";
						
						$.each(rowMapForId, function(i, row){
							if(row.cbx_state == "unchecked"){
								unchecked_count++;
							}
						});
						
						if(unchecked_count == 0){
							thCheckBox.attr('class', CBX_CHECKED_CLS);
						}
					}
				});
			}
			
			
			/**
			 * 显示没有数据
			 * @returns
			 */
			function showNoData()
			{
				var colspan = self.columns.length;
				if(self.checkbox){
					colspan += 1;
				}
				tbody.html('<tr><td colspan="' + colspan  + '"><p class="text-center text-muted"><i class="fa fa-info-circle"></i> 暂无数据</p></td></tr>');
			}
			
			self.data("comp", self);
			
			return self;
		}
	});
})(jQuery);