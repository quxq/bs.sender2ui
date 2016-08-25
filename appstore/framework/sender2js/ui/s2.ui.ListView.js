(function($){
	$.fn.extend({
		"s2.ui.ListView":function(){
			var self=this;
			var ds;
			self.doLayout=function(){
				var p=self.parent();
				self.height(p.height()-2);
			}
			self.item_Click;
			self.addRow=function(xml){
				//xml.find("")
				var templet=$(self.temphtml);
				templet.css("display","block");
				var json=$.toJson(xml);
				//console.log(json);
				//templet.data("userdata",json);
				templet.on("click",function(){
					if(self.item_Click){
					   self.item_Click(json);
					}
				});
				templet.on("mouseover",function(){
					templet.css("background","#efefef");
				});
				templet.on("mouseout",function(){
					templet.css("background","");
				})
				templet.find("[name]").each(function(){
					var row=$(this);
					row.html(json[row.attr("name")]);
				})
				self.append(templet);
			}
			self.distroy=function(){
				self.remove();
				delete self;
			};
			
			self.init=function(){
				self.attr("class","s2-ui-listview");
				ds=$["sender2.ds"]();
				ds.url=self.url||self.attr("s2-url");
				self.temphtml=self.html();
				self.empty();
				
				//ds.data=self.param||self.attr("param");
				ds.loadBefore=function(){
				
				}
				ds.success=[function(xml){	
					xml.find("row").each(function(){
						self.addRow($(this));
					})
					
				}];
//				self.on("click","div",function(){
//					
//				})
			}
			self.load=function(){
				ds.load();
			}
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);