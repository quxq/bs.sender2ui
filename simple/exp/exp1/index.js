(
	function ($) {
		$.fn.extend(
			{
				"page": function () {
					var self=this;
					self.init = function () {
						var toolbar=self.find("#toolbar").data("comp");
						toolbar.add("add","新增",function(){
							var add=$.Dialog("新增","/exp/exp1/add.html");
							setTimeout(function(){
								add.target.load();
							},500);
							
						})
						var dg=self.find("#datagrid").data("comp");
						dg.addRenderCell("worker",$["s2.ui.dgrender.worker"]([
							{id:"delete",label:"删除"},
							{id:"update",label:"修改"}
						]));
//						var d=$.Window({title:"测试",msg:"你好"});
//							d.init();
						dg.addRenderEvent("worker.delete",function(row,t){
							//
							
//							d.toCenter();
//							d.show();
                              // $.Alert(row.name);
							  $.Confirm("你是否要删除当前纪录",function(){
								   $.Alert(row.name);
							  });
						});
						dg.addRenderEvent("worker.update",function(row,t){

							  t.ToolTip({pos:"right",msg:row.name});
							  t.popover({pos:"left",title:"系统提示",msg:row.name});
						});
						
						
						
						dg.load();
					}
					return self;
				}
			});
	}

)(jQuery);
