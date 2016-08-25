(function($){
	$.fn.extend({
		"s2.ui.Split":function(){
			var self=this;
			
			function draw(){
				self.css("position","relative");
				if(self.children().length==2){
					  var child=self.children();
					//self.children().each(function(){
					 //self.sp1=$('<div id="s1" style="float:left;width:200px;"></div>');
					 //self.sp2=$('<div id="s2"></div>');
					 $(child[0]).wrap('<div id="s1" style="float:left;width:200px;overflow:hidden"></div>');
					 $(child[1]).wrap('<div id="s2" style="float:left;overflow:hidden"></div>');
					 self.sp1=self.children("#s1");
					 self.splitbar=$('<div style="float:left;width:4px;"><div id="splitbutton" style="background:#ccc;height:50px;"></div></div>');
					 self.splitbar.insertAfter(self.sp1);
					 self.drag=self.splitbar["s2.drag"]();
					 self.drag.disy=true;
					 self.drag.targetwidth=self.sp1.width();
					 self.drag.mousedown_After=function(){
						 //event.stopPropagation();
						 self.drag.targetwidth=self.sp1.width();
						 self.splitbar.css("background","#efefef");
					 };
					 self.drag.mousemove_After=function(e){
						 //drag.pos();
						 var pos=self.drag.getSpanPos();
						// console.log(self.drag.targetwidth);
						 self.sp1.width(self.drag.targetwidth+pos.x);
						 if(self.sp1.width()<=0){
							 self.sp1.width(0);
							 self.splitbutton.attr("expand","false");
						 }else{
							 self.splitbutton.attr("expand","true");
						 }
						 changeLayout();
						// console.log(e);
					 };
					 self.drag.mouseup_After=function(e){
						 self.drag.targetwidth=self.sp1.width();
						 self.splitbar.css("background","");
					 }
					 self.drag.init();
					 //self.splitbar.on("moused")
					 self.sp2=self.children("#s2");
					 self.splitbutton=self.splitbar.find("#splitbutton");
					// alert($(this))
				  // });
				     self.splitbutton.on("mousedown",splitbutton_Click);
					 self.splitbutton.attr("expand","true");
				}else{
					
					console.error("Split需包含两个组件，请检查下级标签数量");
				}
				
			}
			
			function splitbutton_Click(e){
				e.stopPropagation();
				if(self.splitbutton.is("[expand='true']")){
					self.sp1.css("width","0");
					self.sp1.css("overflow","hidden");
					self.splitbutton.attr("expand","false");
					
				}else{
					if(self.drag.targetwidth<=0){
						self.drag.targetwidth=200;
					}
					self.sp1.css("width",self.drag.targetwidth+"px");
					self.splitbutton.attr("expand","true");
				}
				changeLayout();
			    return false;
			};
			
			function changeLayout(){
				self.doLayout();
				self.find("[s2-comp]").each(function(){
					var comp=$(this).data("comp");
					if(comp.doLayout){
						comp.doLayout();
					}
					
				});
				if(self.splitbutton.is("[expand='true']")){
					self.splitbutton.css("background","#cccccc");
				}else{
					self.splitbutton.css("background","#0f0f0f");
				}
			}
			self.distroy=function(){
				self.remove();			
				delete self;
		    };
			self.doLayout=function(){
				var p=self.parent();
				
				var margin=0;
				if(self.is("[s2-margin]")){
					margin=self.attr("s2-margin");
					self.css("margin",margin+"px");
				}
				self.height(p.height()-margin*2-2);
				self.sp2.width(self.width()-self.sp1.width()-8);
				self.sp2.css("margin-left","7px");
				self.splitbar.css("width","7px");
				self.splitbar.css("left",self.sp1.width()+"px");
				//self.drag.targetwidth=
				self.splitbar.css("height",self.height());
				self.splitbar.find("#splitbutton");
				self.splitbutton.css("margin-top",(self.height()-self.splitbutton.height())/2+"px");
				//self.sp2.css("margin-left","4px");
				self.sp1.height(self.height());
				self.sp2.height(self.height());
			}
			
			self.init=function(){
				draw();
			}
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);