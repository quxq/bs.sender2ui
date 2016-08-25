(function($){
	$.fn.extend({
		"s2.ui.Content":function(){
			var self=this;
			self.init=function(){
				
			}
			self.doLayout=function(){
				self.height(self.parent().height());
			}
			
			self.distroy=function(){
				self.empty();
				self.find("[s2-comp]").each(function(){
					var comp=$(this).data("comp");
					if(comp.distroy){
						comp.distroy();
					}
				});
				delete self;
			}
			
			self.load=function(url){
				self.distroy();
				if(url){
					$.ajax({ url:  url, dataType:"html", async:false, success: function(html){
                    var obj = $(html);
					
					self.append(obj);
					$.compCheck(self.find("[s2-comp='s2.core.CustomComp']")); 
                }});
				}
               
            
			};
			
			self.data("comp",self);
			return self;
		}
	});
})(jQuery)