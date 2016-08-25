(function($){
    /**
     * 管理员页面左侧菜单UI组件
     *
     * 页面属性说明：
     * s2-url:请求数据地址（xml），默认地址$WEB_CONTEXT/_sidebar_menu_default.xml
     */
    $.fn.extend({
        "s2.ui.SidebarMenu" : function()
        {
            var self = this;
            var ds = null;
            //保存id对应的item对象
            var rowMapForId = {};
            //保存父id对应item id数组
            var rowMapForPid = {};

            /**
             * 初始化左侧菜单
             */
            self.init = function()
            {
                ds = $["sender2.ds"]();
                ds.url = this.attr("s2-url") || "/_sidebar_menu_default.xml";
                ds.success = [function(data){
                    createSidebarMenu(data);
                    
                    if(self.success){
                    	self.success();
                    }
                }];
               
            }
            
            /**
             * 加载数据
             */
            self.load = function()
            {
            	 ds.load();
            }

            /**
             * 根据itemId选中item
             */
            self.checkMenuItem = function(id)
            {
            	var item = self.find("#" + getSbmId(id));
            	item.parents(".treeview").addClass("active");
            	item.parents(".treeview-menu").addClass("menu-open");
            	item.addClass("active");
            }
            
            /**
             * 创建SidebarMenu
             * @param data
             */
            function createSidebarMenu(data)
            {
                parseData(data);

                $.each(getChildItemDataByPid("0"), function(i, item){

                    createSidebarMenuItem(item, self);

                });
            }

            /**
             * 创建SideMenuBar item
             * @param row
             * @param conatiner
             * @returns
             */
            function createSidebarMenuItem(row, conatiner)
            {
                var id = row.find("id").text();
                var items = getChildItemDataByPid(id);
                if(items == null){
                    conatiner.append('<li id="' + getSbmId(id) + '"><a href="' + getLink(row) + '"><i class="fa fa-link"></i> <span>' + row.find("name").text() + '</span></a></li>');
                }else{
                    conatiner.append('<li class="treeview" id="' + getSbmId(id) + '"><a href="' + getLink(row) + '"><i class="fa fa-link"></i> <span>' + row.find("name").text() + '</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a></li>');
                    var treeview = conatiner.find("li.treeview:last");
                    treeview.append('<ul class="treeview-menu"></ul>');
                    var treeviewMenu = conatiner.find(".treeview-menu:last");
                    $.each(items,function(i, item){
                        createSidebarMenuItem(item, treeviewMenu);
                    });
                }
            }

            /**
             * 取得itemid
             * @param id
             * @returns
             */
            function getSbmId(id)
            {
            	return 'sbm_item_' + id;
            }
            
            /**
             * 获得item url完整地址
             * @param row
             * @returns
             */
            function getLink(row)
            {
            
            	var url = row.find("url").text();
            	if(!$.trim(url)){
            		url = "#"
            	}else{
            		url = $WEB_CONTEXT + url;
            	}
            	
            	return url;
            }
            
            function getItemDataById(itemId)
            {
                return rowMapForId[itemId];
            }

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

            function parseData(data)
            {
                var rows = data.find("row");

                if(rows.length == 0){
                    return;
                }

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
                $.each(rows,function(i,row){
                    row = $(row);
                    id = row.find("id").text();
                    pid = row.find("pid").text();

                    if(pid){
                        ids.push(id);
                        pids.push(pid);
                    }else{
                        rowMapForPid["0"].push(id);
                    }

                    rowMapForId[id] = row;
                });

                //去除重复的pid
                $.unique(pids);

                ids.sort(function(a,b){
                    return parseInt(a) - parseInt(b);
                });

                pids.sort(function(a,b){
                    return parseInt(a) - parseInt(b);
                });

                var len = ids.length;

                //找出pid对应的item id
                $.each(pids, function(i, myPid){
                    rowMapForPid[myPid] = [];

                    for(var i=0; i<len; i++){
                        row = rowMapForId[ids[i]];
                        pid = row.find("pid").text();

                        if(myPid == pid && pid != 0){
                            rowMapForPid[myPid].push(row.find("id").text());
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