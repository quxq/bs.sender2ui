(
	function($){
		$.fn.extend({
			"nodejs.Window":function(){
				var self=this;
				self.dragestate=false;
				self.normalstate=true;
				self.doLayout=function(){
					//alert("dd")
					var p=self.panelroot.parent();
					self.panelroot.height(p.height());
					self.height(p.height()-self.header.height());
				}
				self.init=function(){
					var gui = require('nw.gui');
					var title=gui.App.manifest.window.title;
					var icon='<img src="'+gui.App.manifest.window.icon+'" style="width:16px;height:16px;float:left;margin:3px;margin-top:10px;"/>';
					var panelroot = $('<div class="nodejs-window"></div>');
				    self.wrap(panelroot);
				    self.panelroot = self.parent();
					//self.panelroot.css("height","100%");
					//self.css("height","100%");
					self.maxbutton=$('<a id="maxbutton" style="float:left;margin:10px 10px 0 0"></a>');
					self.normalbutton=$('<a id="normalbutton" style="float:left;margin:10px 5px 0 0"></a>');
					self.header = $('<div class="cl ' + (self.attr("s2-style") || "header") + '">'+icon+'<span id="headtitle" style="float:left">' +title + '</span><div id="toolbox" class="cl" style="float:right"><div id="c"></div></div></div>')
					self.headerTitle = self.header.find("#headtitle");
					self.toolbox = self.header.find("#c");
					self.toolbox.append(self.normalbutton);
					self.toolbox.append(self.maxbutton);
					self.header.insertBefore(self);
					self.header.on("mousedown",header_MouseDown);
					self.header.on("mousemove",header_MouseMove);
					self.header.on("mouseup",header_MouseUp);
					self.header.on("mouseout",header_MouseUp);
					self.header.on("dblclick",hand_DblClick)
					self.maxbutton.on("click",maxbutton_Click);
					self.normalbutton.on("click",normalbutton_Click);
					self.hand=gui.Window.get();
//					$(window).resize(function(e){
//						if(self.normalstate){
//							self.rect={x:window.screenX,y:window.top,width:window.innerWidth,height:window.innerHeight};
//						}
//
//					});
//					self.rect={x:window.screenX,y:window.top,width:window.innerWidth,height:window.innerHeight};

				}
				
				function hand_DblClick(e){
					if(self.normalstate){
						maxbutton_Click(e);
					}else{
						normalbutton_Click(e);
					}
					
				}
				
				function normalbutton_Click(e){
					self.normalstate=true;
					self.hand.restore();
				}
				
				function maxbutton_Click(e){
					self.normalstate=false;
					self.hand.maximize();
				}
				
				function header_MouseUp(e){
					e.preventDefault();
					self.dragestate=false;
				}
				
				function header_MouseMove(e){
					e.preventDefault();
					if(self.dragestate){
						window.moveBy(event.x-self.oldx,event.y-self.oldy);
					}
				}
				
				
				function header_MouseDown(e){
					self.dragestate=true;
					e.preventDefault();
					self.oldx=event.x
					self.oldy=event.y;
					
					//self.header.css("")
				}
				self.data("comp",self);
				
				
				return self;
			}
		})
		
	}
)(jQuery);