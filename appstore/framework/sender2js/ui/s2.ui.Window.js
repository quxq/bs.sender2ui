(function($){
	$.WindowPool={};
	$.extend({
		Window:function(conf){
			var self={};
			var winid=parseInt(new Date().getTime());
			self.model=true;
			self.panel=null;
			self.box=null;
			var body;
			/**
			 *  绘制头部
			 */
			self.drawHeader=function(){
				
				self.header=$('<div id="header" class="cl"><div style="float:left;margin-left:7px;"><i class="fa fa-cog"></i><span id="title">'+conf.title+'<span></div>'
					+'<div id="toolbox" style="float:right;width:70px;text-align:right;margin-right:7px;"></div></div>');
				var toolbox=self.header.find("#toolbox");
				self.colsebutton=$('<i class="fa fa-close"></i>');
				toolbox.append(self.colsebutton);
				self.colsebutton.click(self.hide);
				self.box.append(self.header);
				
				
			};
			self.setTitle=function(str){
				self.header.find("#title").html(str);
			}
			self.setBox=function(){
				self.drawHeader();
				
				body=$('<div id="body">'+conf.msg+'</div>');
				
				self.box.append(body);
				
				self.panel.append(self.box);
				
			};
			self.setContent=function(c){
				body.empty();
				body.append(c);
			};
			
			self.doLayout=function(){
				var heaheight=0;
				if(self.header){
					heaheight=self.header.height();
				}
				body.height(self.box.height()-heaheight-1);
			};
			
			self.drag=function(){
				 var drag=self.box["s2.drag"]();
				     if(self.header){
						  drag.handler=self.header;
					 }
					 drag.mousedown_After=function(){
	
					 };
					 drag.mousemove_After=function(e){
						self.box.css("opacity","0.3");
					 };
					 drag.mouseup_After=function(e){
						self.box.css("opacity","1");
					 }
					 drag.init();
			}
			/**
			 *  设置窗口大小
			 */
			self.setSize=function(_w,_h){
			    self.box.width(_w).height(_h);
			};
			
			self.init=function(){
				
				var b=$("body");
				var build=b.children("[s2-window]");
                var windocons=null;
				
				if(!build.is("div")){
					windocons=$('<div s2-window="true"></div>');//窗口容器
					b.append(windocons); //第一次创建窗口的时候创建窗口容器；
				}else{
					windocons=b.children("[s2-window='true']");
				}
				if(!windocons.find('#win_'+winid).is("div")){
					console.log("创建窗口"+winid);
					self.panel=$('<div id="win_'+winid+'" class="s2-window"></div>');
					self.box=$('<div class="box"></div>');
					var modeldiv=$('<div id="model"></div>');
					
					if(self.model){
						self.panel.append(modeldiv);
					}
					windocons.append(self.panel);
					self.setBox();
					self.drag();
					//self.doLayout();
					self.panel.data("comp",self);
					self.panel.hide();
				}
			};
			/**
			 * 设置窗口样式名称
			 */
			self.class=function(classname){
				self.panel.attr("class",classname);
			};
			
			self.toCenter=function(){
				var w=$(window);
				self.box.css("left",(w.width()-self.box.width())/2+"px");
				self.box.css("top",(w.height()-self.box.height())/2+"px");
			};
			self.hide=function(){
				self.panel.hide();
			};
			self.distroy=function(){
				self.panel.remove();
				console.log("删除窗口"+winid);
				delete self.panel;
				delete self;
				
			};
			self.show=function(){
				self.panel.show();
			};
			
			return self;
		}
	});
	
	$.extend({
		Alert:function(msg){
			var msgbox=$('<span style="margin:10px 10px 0 10px">'+msg+'</span><div style="text-align:center"><button class="btn btn-info btn-sm" style="margin:7px">确定</button></div>');
			var a=$.Window({title:"系统提示",msg:msg});
			a.hide=function(){
				a.distroy();
				delete a;
			};
			msgbox.find('button').click(a.hide);
			a.init();
			a.setContent(msgbox);
			a.class("s2-window alert");
			
			
			a.show();
			a.toCenter();
		}
	});
	
	$.extend({
		Confirm:function(msg,fn){
			var msgbox=$('<span style="margin:10px 10px 0 10px">'+msg+'</span><div style="text-align:center"><button id="yes" class="btn btn-success btn-sm" style="margin:7px">确定</button><button id="no" class="btn btn-info btn-sm" style="margin:7px">取消</button></div>');
			var a=$.Window({title:"系统提示",msg:msg});
			a.hide=function(){
				a.distroy();
				delete a;
			};
			msgbox.find('#no').click(a.hide);
			msgbox.find('#yes').click(function(){
				if(fn){
					fn();
				}
				a.hide();
			});
			a.init();
			a.setContent(msgbox);
			a.class("s2-window alert");
			
			
			a.show();
			a.toCenter();
		}
	});
	
	$.extend({
		DistroyDialog:function(){
			for(var s in $.WindowPool){
				$.WindowPool[s].distroy();
			}
			delete $.WindowPool;
			$.WindowPool={};
		}
	});
	
	$.extend({
		Dialog:function(_title,url){
			if(!$.WindowPool[url]){
				var msgbox=$('<div s2-comp="s2.ui.Content" id="content"></div>');
				var a=$.Window({title:_title});
				a.init();
				a.setContent(msgbox);
				$.compCheck(msgbox,function(){
					var comp=msgbox.data("comp");
					comp.empty();
					comp.doLayout=function(){};
					comp.load(url);
				});
				a.class("s2-window alert");
				a.show();
				a.toCenter();
				setTimeout(function(){
					var targetcomp=msgbox.find("[s2-comp='s2.core.CustomComp']").data("comp");
				    targetcomp.dialog=a;
				    a.target=targetcomp;
				    $.doLayout(msgbox.find("[s2-comp]"));
					
				},500);
				
				
				$.WindowPool[url]=a;
			}else{
				var w=$.WindowPool[url];
				w.show();
				w.toCenter();
			}
			return $.WindowPool[url];
			
		}
	});
	
	$.fn.extend({
		ToolTip:function(conf){
			var self=this;
			var msgbox=$('<div class="tooltip-arrow" ></div><div class="tooltip-inner">'+conf.msg+'</div>');
			var a=$.Window({title:"系统提示"});
			var tipclass="tooltip";
			if(conf.cls=="popover"){
				tipclass=conf.cls;
				msgbox=$('<div class="arrow" ></div><h3 class="popover-title">'+conf.title+'</h3><div class="popover-content">'+conf.msg+'</div>');
			}
			a.hide=function(){
				a.distroy();
				delete a;
			};
			a.setBox=function(){
				
			};
			a.model=false;
			a.init();
			a.panel.append(msgbox);
			a.class(tipclass+" fade "+conf.pos+" in");			
			a.show();		
			setTimeout(function(){
				a.hide();
			},2000);
			if(conf.pos=="left"){
				a.panel.css("top",self.offset().top+self.outerHeight()/2-a.panel.outerHeight()/2+"px");	
			    a.panel.css("left",(self.offset().left-self.outerWidth()/2-a.panel.outerWidth())+"px");	
				msgbox.css("top","50%");
			}
			if(conf.pos=="top"){
				a.panel.css("top",self.offset().top-self.outerHeight()-a.panel.outerHeight()+"px");	
			    a.panel.css("left",self.offset().left+self.outerWidth()/2-a.panel.outerWidth()/2+"px");	
				msgbox.css("left","50%");
			}
			if(conf.pos=="right"){
				a.panel.css("top",self.offset().top+self.outerHeight()/2-a.panel.outerHeight()/2+"px");
			    a.panel.css("left",(self.offset().left+self.outerWidth())+"px");	
				msgbox.css("top","50%");
			}
			if(conf.pos=="bottom"){
				a.panel.css("top",self.offset().top+self.outerHeight()+"px");	
			    a.panel.css("left",self.offset().left+self.outerWidth()/2-a.panel.outerWidth()/2+"px");	
				msgbox.css("left","50%");	
			}
						
		}
	});
	
	$.fn.extend({
		popover:function(conf){
			conf.cls="popover";
			this.ToolTip(conf);
		}
	});
	
})(jQuery);
