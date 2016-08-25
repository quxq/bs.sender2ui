(
	function ($) {
		$.fn.extend(
			{
				"page": function () {
					var self = this;
					var leftmenu;
					var breadcrumb;
					var content;
					function leftmenu_selectedRow(data){
						//alert(data.name)
						$.DistroyDialog();
						var crumb=[];
						crumb.push({title:"首页",href:"#"});
						leftmenu.getJoinParentNode().each(function(){
							var row=$(this);
							crumb.push({title:row.data("row").name,href:"#"});
							//alert(row.data("row").name);
						});
						crumb.push({title:data.name});
						breadcrumb.load(crumb);
						//content.distroy();
						content.load(data.url);
						
					}
					self.init = function () {
						//alert("dd");
						breadcrumb=self.find("#bcb").data("comp");
						content=self.find("#content").data("comp");
					    leftmenu=self.find("#menu").data("comp");
						leftmenu.selforder = true;
						leftmenu.mapcol = { id: "id", parentid: "pid", label: "name", rootid: "0" };
						leftmenu.selectedRow=leftmenu_selectedRow;
						leftmenu.load();
						
					}
					return self;
				}
			});
	}

)(jQuery);
