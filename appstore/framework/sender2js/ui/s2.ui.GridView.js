(function($){
	$.fn.extend({
		"s2.ui.GridView":function(){
			var self=this;
			var cols=[];
			self.colsnum=1;
			self.space=7;
			self.hw=1;
			self.vmargin=0;
			self.hmargin=0;
			self.doLayout=function(){
				var p=self.parent();
				self.width(p.innerWidth()-self.hmargin*2);
				self.height(p.innerHeight()-self.vmargin*2)
				self.css("margin",self.vmargin+"px "+self.hmargin+"px");
				var v=parseInt(self.innerWidth()/self.colsnum,10);
				for(var i=0;i<cols.length;i++){
					cols[i].width(v-self.space).height((v-self.space)*self.hw-self.space);
					cols[i].css("margin",self.space+"px 0 0 "+self.space+"px");
					//console.log(Math.floor((i+1)/self.colsnum));
//					if(Math.floor(i/self.colsnum)==0){
//						cols[i].css("margin-top","0");
//					}
					if(i%parseInt(self.colsnum)==self.colsnum-1){
						cols[i].width(v-self.space*2);
						cols[i].css("margin-right",self.space+"px");
					}
					
					
				}
			}
			self.distroy=function(){
				self.remove();
				delete self;
			};
			self.init=function(){
				if(self.is("[s2-cols]")){
					self.colsnum=self.attr("s2-cols");
				}else{
					console.error("GridView 必须指定s2-cols的值");
				}
				if(self.is("[s2-hw]")){
					self.hw=self.attr("s2-hw");
				}
				
				if(self.is("[s2-vmargin]")){
					self.vmargin=self.attr("s2-vmargin");
				}
				if(self.is("[s2-hmargin]")){
					self.hmargin=self.attr("s2-hmargin");
				}
				
				self.attr("class","cl");
				self.children().each(function(i){
					var col=$(this);
					col.wrap('<div style="float:left"></div>');
					cols[i]=col.parent();
					
				});
			};
			
			self.data("comp",self);
			return self;
		}
	 }
	);
})(jQuery)