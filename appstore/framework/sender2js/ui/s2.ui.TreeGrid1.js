(function($){
	/**
	 * 数据表格UI组件
	 */
	$.fn.extend({
		"s2.ui.TreeGrid" : function()
		{
			//checkbox选中图标
			var CBX_CHECKED_CLS = "cbx-checked fa fa-check-square-o";
			//checkbox未选中图标
			var CBX_UN_CHECKED_CLS = "cbx-unchecked fa fa-square-o";
			
			var self = this;
			
			var ds = null;
			
			var columns = null;
			var thead = null;
			var workerBtnConf = {};
			var treeview = null;
			
			//保存数据与树字段的映射关系
			self.treeMap = {id:"id", pid:"pid", name:"name"};
			self.checkbox = false;
			/**
			 * 初始化
			 */
			self.init = function()
			{
				if($.trim(self.attr("s2-map"))){
					self.treeMap = eval('('+self.attr("s2-map")+')');
				}
				
				columns = eval(self.attr("s2-columns"));
				
				if($.trim(self.attr("s2-checkbox"))){
					self.checkbox = eval(self.attr("s2-checkbox"));
				}
				
				//创建表格视图
				createView();
				
				treeview = self["s2.ui.TreeView"]();
				treeview.createNodeAdapter = createNodeAdapter;
				treeview.colNum = columns.length;
				treeview.success = function(rows)
				{
					bindEvents(rows);
				}
				treeview.doSelectAfter = function()
				{
					var rows = treeview.getCheckedRows(true);
					
					if(rows == null){
						thead.find("i[class^='cbx-']").attr("class", CBX_UN_CHECKED_CLS);
						return;
					}
					
					if(rows.length == treeview.getSize()){
						thead.find("i[class^='cbx-']").attr("class", CBX_CHECKED_CLS);
					}else{
						thead.find("i[class^='cbx-']").attr("class", CBX_UN_CHECKED_CLS);
					}
				}
				treeview.init();
			}
			
			/**
			 * 添加按钮和回调方法
			 */
			self.addWorkerButton = function(btnKey, btnName, callback)
			{
				workerBtnConf[btnKey] = {btnKey:btnKey, btnName:btnName, callback:callback};
			}
			
			function bindEvents(rows)
			{
				thead.find("i[class^='cbx-']").on("click", function(){
					if($(this).hasClass("cbx-unchecked")){
						treeview.selectAll();
					}else{
						treeview.unselectAll();
					}
				});
			}
			
			/**
             * 创建节点
             * @param row
             * @param container
             * @param isleaf
             * @param rowStyle
             * @param indents
             * @param iconCls
             * @param checkbox
             * @returns
             */
            function createNodeAdapter(row, container, isleaf, rowStyle, indents, iconCls, checkbox)
            {
            	var content = "";
            	var value = "";
            	$.each(columns, function(i, c){
            		if(c.field != self.treeMap.name && c.field != 'worker'){
            			if(self.render){
            				value = self.render(c.field, row);
            			}else{
            				value = row[c.field];
            			}
            			
            			if(!$.trim(value)){
            				value = '--';
                    	}
            			
            			content += '<td>' + value + '</td>';
            			
            		}else if(c.field == "worker"){
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
            			
            			content += '<td>' + value + '</td>';
            		}
            	});
            	
            	var name = "";
            	if(self.render){
            		name = self.render(self.treeMap.name, row);
            	}else{
            		name = row[self.treeMap.name];
            	}
            	
            	if(!$.trim(name)){
            		name = '--';
            	}
            	
            	tr = $(tr);
				
				//添加行
            	container.append(tr);
				
				//注册worker方法
				for(var k in workerBtnConf){
					
					tr.find('[s2-btnKey="' + k + '"]').click(function(e) {
						var s2_id = $(this).parents("tr").attr("s2-id");
						workerBtnConf[$(this).attr("s2-btnKey")].callback(rowMapForId[s2_id]);
					});
				}
            	
				var tr = "";
				
            	if(isleaf){
            		tr = '<tr style="' + rowStyle + '" s2-id="' + row[self.treeMap.id] + '"><td>' + indents + '<span class="indent8"></span>' +checkbox + '<span>' + name + '</span></td>' + content + '</tr>';
            	}else{
            		tr = '<tr style="' + rowStyle + '" s2-id="' + row[self.treeMap.id] + '"><td>' + indents + '<i class="' + iconCls + '"></i>' + checkbox + '<span>' + name + '</span></td>' + content + '</tr>';
            	}
            	
            	tr = $(tr);
            	
            	container.append(tr);
            	
            	//注册worker方法
				for(var k in workerBtnConf){
					
					tr.find('[s2-btnKey="' + k + '"]').click(function(e) {
						var s2_id = $(this).parents("tr").attr("s2-id");
						workerBtnConf[$(this).attr("s2-btnKey")].callback(treeview.getData()[s2_id]);
					});
				}
            }
			
			
			/**
			 * 创建表视图
			 * @returns
			 */
			function createView()
			{
				self.addClass("table table-bordered table-hover")
				    .append("<thead><tr></tr></thead>");
				
				thead = self.find("thead");
				
				var myCols = [];
				var treeCol = null;
				
				$.each(columns, function(i, col){
					if(col.field == self.treeMap.name){
						treeCol = col;
					}else{
						myCols.push(col);
					}
				});
				
				myCols.unshift(treeCol);
				
				columns = myCols;
				
				var tr = thead.find("tr");
				
				$.each(columns, function(i, c){
					if(c.width){
						if(self.checkbox && i == 0){
							tr.append('<th width="' + c.width + 'px"><i class="' + CBX_UN_CHECKED_CLS + '" style="margin-left:9px;"></i>' + c.title + '</th>');
						}else{
							tr.append('<th width="' + c.width + 'px">' + c.title + '</th>');
						}
					}else{
						if(self.checkbox && i == 0){
							tr.append('<th><i class="' + CBX_UN_CHECKED_CLS + '" style="margin-left:9px;"></i>' + c.title + '</th>');
						}else{
							tr.append('<th>' + c.title + '</th>');
						}
					}
				});
			}
			
			self.data("comp", self);
			
			return self;
		}
	});
})(jQuery);