(function($){
	$.fn.extend({
		"s2.ui.TabPage":function()
		{
			var self=this;
			var header=null;
			var body=null;
			self.headerStyle="tabpage-style1";
			self.childComp=[];
			function draw(){
				self.append('<div id="header" class="cl"></div>');
				self.append('<div id="body"></div>');
			};
			self.click_After=null;
			self.add=function(title,target,data){
				var dt=$('<dt style="float:left"><a href="javascript:void(0)">'+title+'</a></dt>');
				if(!header.find("dl").is("dl")){
					header.append('<dl class="cl"></dl>');
				}
				header.find("dl").append(dt);				
				
				body.append(target);
				if(target){
					target.hide();
				}else{
					body.hide();
				}
				
				if(data){
					dt.find("a").data("d1",data);
				}
				dt.find("a").click(function(){
					var t=$(this);
					header.find("a").removeAttr("class");
					body.children().hide();
					t.attr("class","active");
					
					if(target){
						//alert(target.show)
						if(target.is("[comp='sender2.ui.panel']")){
							target.parents(".s2-panel:eq(0)").show();
						}
						target.show();
						$.doLayout(self.parent().find("[s2-comp]"));
					}
					if(self.click_After){
						if(t.data("d1")){
							self.click_After(t.data("d1"));
						}else{
							self.click_After();
						}
						
					}
				});	
				dt.find("a").mouseover(function(){
					
					var t=$(this);
					if(!t.is(".active")){
						t.attr("class","hover");
					}
				});
                dt.find("a").mouseout(function(){
					
					var t=$(this);
					if(!t.is(".active")){
						t.removeAttr("class");
					}
				});
							
			};
			self.togTab=function(index){
				header.find("a:eq("+index+")").click();
			};
			
			
			
			self.doLayout=function()
			{
			       //alert("d");
					var p=self.parent();
					
					
					//self.width(p.width());					
					self.height(p.height()-2);
					p.css("overflow","hidden");
				
					body.width(p.width());
					body.height(p.height()-header.height()-4);
				
			};
			self.distroy=function(){
				self.remove();			
				delete self;
		    };
			self.init=function(){
				
				self.attr("class",self.headerStyle);
				draw();
				header=self.find("#header");
				//header.css("height",'35px');
				self.css("overflow","hidden");
				body=self.find("#body");
				body.css("overflow","hidden");
				//alert(self.html());
				//alert(self.children("[s2-title]").length);
				if(self.is("[s2-border]")){
					self.css("border","solid 1px #efefef");
					self.css("border-radius","3px");
				}
				self.children("[s2-title]").each(function(){
					var t=$(this);
					
					self.add(t.attr("s2-title"),t,{});
				});
				if(self.parentComp){
					if(self.parentComp.childComp){
						self.parentComp.childComp.push(self);
					}	
				}
			  
				self.togTab(0);
				
			};
			self.data("comp",self);
			return self;
						
		}
	});
	
	
	
})(jQuery);