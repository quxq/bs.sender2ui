(function($){
	$.fn.extend({
		"s2.ui.Anchor":function(){
			var self=this;
		    self.rect={left:0,top:0,right:0,buttom:0};
			self.s2width=400;
			self.s2height=300;
			var anchor={left:false,top:false,right:true,buttom:true}
			self.doLayout=function(){
				var p=self.parent();
				var h=0,w=0,t=0,l=0;
				self.css("margin-left",self.rect.left+"px");
				self.css("margin-top",self.rect.top+"px");
				self.css("margin-right",self.rect.right+"px");
				console.log(self.rect.right)
				self.css("margin-buttom",self.rect.buttom+"px");
				if(anchor.left){
					
					w-=self.s2width;
				}else{
					l=p.width()-self.s2width-self.rect.right;
					self.css("margin-left",l+"px");
				}
				if(anchor.top){
					
					h-=self.s2height;
				}else{
					t=p.height()-self.s2height-self.rect.buttom;
					self.css("margin-top",t+"px");
				}
				//self.width(p.width()-self.rect.left-self.rect.right+w);
				//self.height(p.height()-self.rect.top-self.rect.buttom+h);
				if(!anchor.right||!anchor.left){
					
					//w=(self.s2width-self.rect.left-self.rect.right);
					self.width(self.s2width);
				}else{
				  self.width(p.width()-self.rect.left-self.rect.right);	
				}
				if(!anchor.buttom||!anchor.top){
					
					self.height(self.s2height);
				}else{
					self.height(p.height()-self.rect.top-self.rect.buttom);
				}
				
				//self.css("margin",self.rect.top+"px "+self.rect.right+"px "+self.rect.buttom+"px "+self.rect.left+"px ");
			};
			self.distroy=function(){
				self.remove();
				delete self;
			}
			self.init=function(){
				self.css("position","absolute");
				if(self.is("[s2-point]")){
					var point=self.attr("s2-point").split(",");
					self.rect={top:point[0],right:point[1],buttom:point[2],left:point[3]};
				}else
				{
					console.log("anchor 必须指定s2-point属性的值");
				}
				self.s2width=self.attr("s2-width");
				self.s2height=self.attr("s2-height");
				var a=self.attr("s2-anchor").split(",");
				anchor.top=(a[0]=="true"?true:false);
				anchor.right=(a[1]=="true"?true:false);
				anchor.buttom=(a[2]=="true"?true:false);
				anchor.left=(a[3]=="true"?true:false);
				
			};
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);