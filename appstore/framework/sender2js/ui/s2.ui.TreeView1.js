(function($){
	/**
	 * 简单树形UI组件
	 */
	$.fn.extend({
		"s2.ui.TreeView" : function()
		{
			//checkbox选中图标
			var CBX_CHECKED_CLS = "cbx-checked fa fa-check-square-o";
			//checkbox未选中图标
			var CBX_UN_CHECKED_CLS = "cbx-unchecked fa fa-square-o";
			//checkobx半选图标
			var CBX_HALF_CHECKED_CLS = "cbx-halfchecked fa fa-check-square";
			
			//节点展开图标
			var ICON_EXPAND_CLS = "icon fa fa-angle-down";
			//节点折叠图标
			var ICON_FLOD_CLS = "icon fa fa-angle-right";
			
			//节点展开图标名称
			var ICON_EXPAND_NAME = "fa-angle-down";
			//节点折叠图标名称
			var ICON_FLOD_NAME = "fa-angle-right";
			
			var self = this;
			
			var ds = null;
			
			//保存id对应的item对象
            var rowMapForId = {};
            //保存父id对应item id数组
            var rowMapForPid = {};
            //行数
			var rowSize = 0;
            //当前选择的item编号
			var curSelectedItemId = null;
			
			var tbody = null;
			
			//保存数据与树字段的映射关系
			self.treeMap = {id:"id", pid:"pid", name:"name"};
			//是否全部展开，默认全部展开
			self.expand = true;
			//是否显示复选框，默认不显示
			self.checkbox = false;
            //是否开启自动加载，默认开启
			self.autoLoad = true;
			//列数
			self.colNum = 1;
			
			/**
			 * 初始化treeview
			 */
			self.init = function()
			{
				
				self.addClass("table table-hover s2ui-treeview")
			        .append("<tbody></tbody>");
			
				tbody = self.find("tbody");

				if($.trim(self.attr("s2-url"))){
					self.url = self.attr("s2-url");
				}
				
				if($.trim(self.attr("s2-map"))){
					self.treeMap = eval('('+self.attr("s2-map")+')');
				}
				
				if($.trim(self.attr("s2-expand"))){
					self.expand = eval(self.attr("s2-expand"));
				}
				
				if($.trim(self.attr("s2-checkbox"))){
					self.checkbox = eval(self.attr("s2-checkbox"));
				}
				
				if($.trim(self.attr("s2-autoLoad"))){
					self.autoLoad = eval(self.attr("s2-autoLoad"));
				}
				
				ds = $["sender2.ds"]();
				ds.url = self.url;
				ds.success = [function(data){
					createTreeView(data);
					
					if(self.loadSuccess){
						self.loadSuccess(data);
					}
				}];
				
				if(self.autoLoad){
					ds.load();
				}
			}
			
			/**
			 * 获取所有数据
			 */
			self.getData = function()
			{
				return rowMapForId;
			}
			
			/**
			 * 设置tree数据
			 */
			self.setData = function(data)
			{
				var newdata = $.extend(true, {}, data);
				parseJson(newdata);
			}
			
			/**
			 * 创建tree
			 */
			self.create = function()
			{
				if($.isEmptyObject(rowMapForId)){
					showNoData();
					return;
				}
				
				if(self.createViewAdapter){
	                	$.each(getChildItemDataByPid("0"), function(i, item){

	                		self.createViewAdapter(item, self, 0);

	                    });
	                }else{
	                	$.each(getChildItemDataByPid("0"), function(i, item){

	                    	createTreeViewItem(item, self, 0);

	                    });
	            }
				 
				bindEvents();
			}
			
			/**
			 * 清除选择状态
			 */
			self.clearSelectedRow = function()
			{
				tbody.find("tr").removeClass("success");
				for(var key in rowMapForId){
					rowMapForId[key].cbx_state = "unchecked";
				}
				curSelectedItemId = null;
			}
			
			/**
			 * 选择行
			 */
			self.selectRow = function(id)
			{
				tbody.find('tr').removeClass('success');
				tbody.find('tr[s2-id="' + id + '"]').attr("class","success");
				
				for(var key in rowMapForId){
					rowMapForId[key].cbx_state = "unchecked";
				}
				
				curSelectedItemId = id;
				
				var row = rowMapForId[id];
				row.cbx_state = "checked";
				
				return row;
			}
			
			/**
			 * 选中多行
			 */
			self.checkRows = function(ids)
			{
				self.unselectAll();
				
				var node = null;
				
				for(var i = 0; i < ids.length; i++) {
					node = tbody.find('tr[s2-id="' + ids[i] + '"]');
					node.find("i[class^='cbx-']").attr("class", CBX_CHECKED_CLS);
					doCheck(node, "checked", CBX_CHECKED_CLS);
					setParentNodeCbxState(node);
				}
			}
			
			/**
			 * 获取数据大小
			 */
			self.getSize = function()
			{
				return rowSize;
			}
			
			/**
			 * 选中所有节点
			 */
			self.selectAll = function()
			{
				for(var id in rowMapForId){
					tbody.find('tr[s2-id="' + id + '"]')
						.find("i[class^='cbx-']")
						.attr("class", CBX_CHECKED_CLS);
					
					rowMapForId[id].cbx_state = "checked";
				}
				
				if(self.doSelectAfter){
					self.doSelectAfter();
				}
			}
			
			/**
			 * 取消选中所有节点
			 */
			self.unselectAll = function()
			{
				tbody.find('tr')
					.find("i[class^='cbx-']")
					.attr("class", CBX_UN_CHECKED_CLS);
				
				for(var id in rowMapForId){
					rowMapForId[id].cbx_state = "unchecked";
				}
				
				if(self.doSelectAfter){
					self.doSelectAfter();
				}
			}
			
			/**
			 * 获取选择的行数据
			 */
			self.getSelectedRow = function()
			{
				if(curSelectedItemId == null){
					return null;
				}
				
				return rowMapForId[curSelectedItemId];
			}
			
			/**
			 * 获取选中的节点数据
			 * @param isHalf 是否包含半选节点
			 */
			self.getCheckedRows = function(isHalf)
			{
				var rows = [];
				var row = null;
				var count = 0;
				for(var id in rowMapForId){
					row = rowMapForId[id];
					
					if(isHalf){
						if(row.cbx_state == "checked" 
							|| row.cbx_state == "halfchecked"){
							rows.push(row);
							count++;
						}
					}else{
						if(row.cbx_state == "checked"){
							rows.push(row);
							count++;
						}
					}
				}
				
				if(count == 0){
					return null;
				}
				
				return rows;
			}
			
			/**
			 * 加载数据
			 */
			self.load = function(params)
			{
				if(params){
					ds.data = params;
				}
				ds.load();
			}
			
			/**
			 * 显示没有数据
			 * @returns
			 */
			function showNoData()
			{
				tbody.html('<tr><td colspan="' + self.colNum + '"><p class="text-center text-muted"><i class="fa fa-info-circle"></i> 暂无数据</p></td></tr>');
			}
			
			/**
			 * 绑定事件
			 * @returns
			 */
			function bindEvents()
			{
				var items = tbody.find("tr");
				
				if(!self.checkbox){
					items.on("click", function(){
						var id = $(this).attr("s2-id");
						var row = self.selectRow(id);
						if(self.doClickAfter){
							self.doClickAfter(row);
						}
						
					});
				}
				
				items.find("i.icon").on("click", function(e){
					var node = $(this).parents("tr");
					if($(this).hasClass(ICON_FLOD_NAME)){
						$(this).attr("class", ICON_EXPAND_CLS);
						expend(node, false);
					}else{
						$(this).attr("class", ICON_FLOD_CLS);
						flod(node, false);
					}
					
					e.stopPropagation();
				});
				
				items.find("i[class^='cbx-']").on("click", function(e){
					var node = $(this).parents("tr");
					
					if($(this).hasClass("cbx-unchecked")){
						$(this).attr("class", CBX_CHECKED_CLS);
						doCheck(node, "checked", CBX_CHECKED_CLS);
						setParentNodeCbxState(node);
					}else{
						$(this).attr("class", CBX_UN_CHECKED_CLS);
						doCheck(node, "unchecked", CBX_UN_CHECKED_CLS);
						setParentNodeCbxState(node);
					}
					
					if(self.doSelectAfter){
						self.doSelectAfter();
					}
					
					e.stopPropagation();
				});
			}
			
			/**
			 * 执行选中操作
			 * @param node 当前tree节点
			 * @param checkedState 选中状态 checked:选中，unchecked:未选中
			 * @param checkedCls 选中图标 CBX_CHECKED_CLS：选中，CBX_UN_CHECKED_CLS：未选中
			 * @returns
			 */
			function doCheck(node, checkedState, checkedCls)
			{
				var id = node.attr("s2-id");
				var items = getChildItemDataByPid(id);
				
				rowMapForId[id].cbx_state = checkedState;
				
				if(items != null){
					$.each(items, function(i, item){
						var _node = tbody.find('tr[s2-id="' + item[self.treeMap.id] + '"]');
						_node.find("i[class^='cbx-']").attr("class", checkedCls);
						doCheck(_node, checkedState, checkedCls);
		            });
				}
			}
			
			/**
			 * 设置父节点选中状态
			 * @param node 当前tree节点
			 * @returns
			 */
			function setParentNodeCbxState(node)
			{
				var pid = rowMapForId[node.attr("s2-id")].pid;
				
				if(!pid){
					return;
				}
				
				var pNode = tbody.find('tr[s2-id="' + pid + '"]');
				var items = getChildItemDataByPid(pid);
				var checkedCount = 0;
				var len = items.length;
				
				for(var i=0; i<len; i++){
					
					if(items[i].cbx_state == 'checked'){
						checkedCount++;
					}
				}
				
				if(checkedCount == 0){
					rowMapForId[pid].cbx_state = "unchecked";
					pNode.find("i[class^='cbx-']").attr("class", CBX_UN_CHECKED_CLS);
				}else if(checkedCount == len){
					rowMapForId[pid].cbx_state = "checked";
					pNode.find("i[class^='cbx-']").attr("class", CBX_CHECKED_CLS);
				}else{
					rowMapForId[pid].cbx_state = "halfchecked";
					pNode.find("i[class^='cbx-']").attr("class", CBX_HALF_CHECKED_CLS);
				}
				
				setParentNodeCbxState(pNode);
			}
			
			/**
			 * 展开节点
			 * @param node 当前tree节点
			 * @param cascade
			 * @returns
			 */
			function expend(node, cascade)
			{
				if(cascade){
					node.find("i.icon").attr("class", ICON_EXPAND_CLS);
				}
				
				var items = getChildItemDataByPid(node.attr("s2-id"));
				
				if(items != null){
					$.each(items,function(i, item){
						var _node = tbody.find('tr[s2-id="' + item[self.treeMap.id] + '"]');
						_node.show();
						
						if(_node.find("i.icon").length > 0 && _node.find("i.icon").hasClass(ICON_EXPAND_NAME)){
							expend(_node, cascade);
						}
		            });
				}
					 
			}
			
			/**
			 * 折叠节点
			 * @param node 当前tree节点
			 * @param cascade
			 * @returns
			 */
			function flod(node, cascade){
				if(cascade){
					node.find("i.icon").attr("class", ICON_FLOD_CLS);
				}
				
				var items = getChildItemDataByPid(node.attr("s2-id"));
				
				if(items != null){
					$.each(items,function(i, item){
						var _node = self.find('tr[s2-id="' + item[self.treeMap.id] + '"]');
						_node.hide();
						
						if(_node.find("i.icon").length > 0){
							flod(_node, cascade);
						}
		            });
				}
				
			}
			
			  /**
             * 创建TreeView
             * @param data
             */
            function createTreeView(data)
            {
            	
                parseXml(data);
                self.create();
                
            }

            /**
             * 创建TreeView Item
             * @param row
             * @param conatiner
             * @param indentNum
             * @returns
             */
            function createTreeViewItem(row, container, indentNum)
            {
            	var pid = row[self.treeMap.pid];
                var items = getChildItemDataByPid(row[self.treeMap.id]);
                 
            	var indents = '';
            	for(var i=0; i<indentNum; i++){
            		indents += '<span class="indent20"></span>';
            	}
            	
            	var checkbox = '';
            	if(self.checkbox){
            		checkbox = '<i class="' + CBX_UN_CHECKED_CLS + '"></i>';
            	}
            	
            	var rowStyle = "visibility: hidden;";
            	var iconCls = ICON_FLOD_CLS;
            	
            	if(self.expand){
            		rowStyle = "visibility: visible;";
            		iconCls = ICON_EXPAND_CLS;
            	}else{
            		if(pid){
            			rowStyle = "visibility: visible;";
                	}else{
                		rowStyle = "visibility: hidden;";
                	}
            	}
            	
                if(items == null){
                	if(self.createNodeAdapter){
                		self.createNodeAdapter(row, container, true, rowStyle, indents, iconCls, checkbox);
                	}else{
                		createNode(row, container, true, rowStyle, indents, iconCls, checkbox);
                	}
                }else{
                	indentNum++;
                	
                	if(self.createNodeAdapter){
                		self.createNodeAdapter(row, container, false, rowStyle, indents, iconCls, checkbox);
                	}else{
                		createNode(row, container, false, rowStyle, indents, iconCls, checkbox);
                	}
                	
                	$.each(items,function(i, item){
                    	createTreeViewItem(item, container, indentNum);
                    });
                }
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
            function createNode(row, container, isleaf, rowStyle, indents, iconCls, checkbox)
            {
            	if(isleaf){
            		container.append('<tr style="' + rowStyle + '" s2-id="' + row[self.treeMap.id] + '"><td>' + indents + '<span class="indent8"></span>' +checkbox + '<span>' + row[self.treeMap.name] + '</span></td></tr>');
            	}else{
            		container.append('<tr style="' + rowStyle + '" s2-id="' + row[self.treeMap.id] + '"><td>' + indents + '<i class="' + iconCls + '"></i>' + checkbox + '<span>' + row[self.treeMap.name] + '</span></td></tr>');
            	}
            }
            
			/**
			 * 根据编号取得item数据
			 * @param itemId
			 * @returns
			 */
			function getItemDataById(itemId)
            {
                return rowMapForId[itemId];
            }

			/**
			 * 根据编号取得所有子节点的编号数组
			 * @param pid
			 * @returns
			 */
            function getChildItemDataByPid(pid)
            {
                var ids = rowMapForPid[pid];
                if(!ids){
                    return null;
                }

                var array = [];
                $.each(ids, function(i, myId){
                    array.push(getItemDataById(myId));
                });
                return array;
            }

            /**
             * 解析服务器端xml数据
             * @param data
             * @returns
             */
            function parseXml(data)
            {
                var rows = data.find("row");

                if(rows.length == 0){
                    return;
                }

                rowSize = rows.length;
                
                //保存item id数组
                var ids = [];
                //保存父item id数组
                var pids = [];

                var id = null;
                var pid = null;
                var row = null;

                //将没有pid的item初始化
                rowMapForPid["0"] = [];
                
                /*
                                                           循环找出
                 ids,
                 pids,
                 rowMapForId,
                 rowMapForPid["0"]
                                                          对应的item数据
                 */
                var rowJson = null;
                
                $.each(rows, function(i, row){
                    row = $(row);
                    id = row.find(self.treeMap.id).text();
                    pid = row.find(self.treeMap.pid).text();

                    if(pid){
                        ids.push(id);
                        pids.push(pid);
                    }else{
                        rowMapForPid["0"].push(id);
                    }
                    
                    //将xml数据格式转换成json数据格式
                    var rowJson = $.toJson(row);
                    rowJson.cbx_state = "unchecked";
                    rowMapForId[id] = rowJson;
                });

                parse(ids, pids);
            } 
			
            /**
             * 解析json数据
             * @param data
             * @returns
             */
            function parseJson(data)
            {
            	
            	if(!data){
            		return;
            	}
            	
            	if(data.length < 1){
            		return;
            	}
            	
            	rowSize = data.length;
            	
            	//保存item id数组
                var ids = [];
                //保存父item id数组
                var pids = [];

                var id = null;
                var pid = null;
                var row = null;

                //将没有pid的item初始化
                rowMapForPid["0"] = [];
                
                $.each(data, function(i, row){
                    id = row[self.treeMap.id];
                    pid = row[self.treeMap.pid];

                    if(pid){
                        ids.push(id);
                        pids.push(pid);
                    }else{
                        rowMapForPid["0"].push(id);
                    }
                    
                    rowMapForId[id] = row;
                });

                parse(ids, pids);
            }
            
            /**
             * 解析数据通用方法
             * @param ids
             * @param pids
             * @returns
             */
            function parse(ids, pids)
            {
            	//去除重复的pid，这里不能使用jquery的unique方法，因为该方法在ie中不能有效去重
            	pids = $.uniq(pids);

                ids.sort(function(a, b){
                    return parseInt(a) - parseInt(b);
                });

                pids.sort(function(a, b){
                    return parseInt(a) - parseInt(b);
                });

                var len = ids.length;

                //找出pid对应的item id
                $.each(pids, function(i, myPid){
                    rowMapForPid[myPid] = [];

                    for(var i=0; i<len; i++){
                        row = rowMapForId[ids[i]];
                        pid = row[self.treeMap.pid];

                        if(myPid == pid && pid != 0){
                            rowMapForPid[myPid].push(row[self.treeMap.id]);
                            ids.splice(i,1);
                            len--;
                            i--;
                        }
                    }
                });
            }
            
			self.data("comp", self);
			
			return self;
		}
	});
})(jQuery);