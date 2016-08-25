(function($){
	$.fn.extend({
		"s2.ui.Vbox":function(){
			var self=this;
			self.rows=[];
			self.doLayout=function(){
				var p=self.parent();
				self.height(p.height()-2);
				var anyheight=null;
				var removeHeight=0;
				for(var i=0;i<self.rows.length;i++){
					if(self.rowsnum[i]!="*"){
						removeHeight=removeHeight+parseInt(self.rowsnum[i]);
						self.rows[i].height(self.rowsnum[i]);
					}else{
						anyheight=self.rows[i];
					}
					
					
				}
				if(anyheight!=null){
					//console.log(self.height()-removeHeight);
					anyheight.height(self.height()-removeHeight);
				}
			}
			self.distroy=function(){
				self.remove();			
				delete self;
		    };
			self.init=function(){
				
				if(!self.is("[s2-rows]")||self.attr("s2-rows")==""){
					console.error("s2-rows 属性未定义");
				}
				self.rowsnum=self.attr("s2-rows").split(",");
				if(self.rowsnum.length!=self.children().length){
					console.error("s2-rows 属性值和子组件数量不匹配");
				}
				
				
				self.children().each(function(i){
					var row=$(this);
					row.wrap('<div id="row'+i+'"></div>"');
					self.rows[i]=row.parent();
				})
				//self.attr("s2-rows")
			}
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);