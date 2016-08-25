/**
 * 页面启动入口
 */


(function($){
	var S2_Comps=document.appconfig;
	var S2_Type=document.s2type;
	var S2_Plugin=document.plugin;
	/**
	 * 数组去重
	 */
	$.extend({
		uniq:function(a)
		{
			var n = {}, r=[]; //n为hash表，r为临时数组
			
			for(var i = 0; i < a.length; i++) //遍历当前数组
			{
				if (!n[a[i]]) //如果hash表中没有当前项
				{
					n[a[i]] = true; //存入hash表
					r.push(a[i]); //把当前数组的当前项push到临时数组里面
				}
			}
			
			return r;
		}
	});
	
	$.extend({
    	cssLoad:function(_url){
			//alert(_url);
    	   //<link rel="stylesheet" type="text/css" href="/fileupload/plugin/dhtmlxvault.css"/>
    	   var h=$("head");
    	   if(!h.find("link[url='"+_url+"']").is("link"))
    	   {
    		   h.append('<link rel="stylesheet" type="text/css" href="'+_url+'"/>');
    	   }
    	}
    });
	    
    $.extend({
		mousePoint:function(e){
			var posx = 0;
			var posy = 0;
			if (!e){
				e = window.event;
			} 
				
			if (e.pageX || e.pageY) {
					posx = e.pageX;
					posy = e.pageY;
			}
			else if (e.clientX || e.clientY) {
					posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
			}
			return { 'x': posx, 'y': posy };	
		}
	});
	
   	$.fn.extend({
   		"s2.drag":function(){
   			var self=this;
   			var isMouseDown=false;
   			var lastMouseX=0,lastMouseY=0,lastElemTop=0,lastElemLeft=0;
   			var dragStatus = false;
   			self.mousedown_CallBack;//执行拖动鼠标按下后的回调方法
   			self.disx=false;
   			self.disy=false;	
   			var spanX=0;
   			var spanY=0;
			//=0;
   			function updatePoint(e)
   			{
   				var pos = $.mousePoint(e);
   				spanX = (pos.x - lastMouseX);
   				spanY = (pos.y - lastMouseY);
   				if(!self.disy){
   					self.css("top",  (lastElemTop + spanY)+"px");
   				}
   				if(!self.disx){
   					self.css("left", (lastElemLeft + spanX)+"px");
   					//lastElemLeft=lastElemLeft + spanX;
   				}  				
   				
   			}
   			
   			self.getSpanPos=function()
   		    {
   				return {x:spanX,y:spanY};
   		    };
   			
   			function disSelect()
   			{
   				return false;
   			}
   			
   			function offmouse()
   			{
   				if (!window.captureEvents) {
   			       self.get(0).setCapture();
   			     
   			     }else {
   			       window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
   			     }
   				document.onselectstart=disSelect;
   				//$(document).css("-moz-user-select","none");
   			};
   			
   			function onmouse()
   			{
   				if (!window.captureEvents) {
   				   self.get(0).releaseCapture();
   				   
   				   
   			    }else {
   			       window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
   			    }
   				document.onselectstart=null;
   				//$(document).css("-moz-user-select","");
   			}
   			
   			function self_mousedown(e)
   			{
				   e.preventDefault();
				e.stopPropagation();
   				//$(document).click();
   				//$("#focustext").val("11");
   				isMouseDown=true;
   				dragStatus=true;
   				var pos= $.mousePoint(e);
				lastMouseX = pos.x;
				lastMouseY = pos.y;
				lastElemTop  = self.get(0).offsetTop;
				lastElemLeft = self.get(0).offsetLeft;
				updatePoint(e);
				if(self.mousedown_After)
				{
					self.mousedown_After(e);
				}
   				offmouse();
   				return false;
   			};
   			
   			
   			function document_mouseup(e)
   			{
				   e.preventDefault();
				   e.stopPropagation();
   				if(isMouseDown&&dragStatus!=false){
   					isMouseDown=false;
   					lastElemTop  = self.get(0).offsetTop;
   					lastElemLeft = self.get(0).offsetLeft;
   					onmouse();
   					if(self.mouseup_After)
   					{
   						self.mouseup_After(e);
   					}
   					//$(document).unbind("mousemove",document_mousemove);
   				}
   				return false;
   			};
   			function document_mousemove(e)
   			{
				e.preventDefault();
   				if(isMouseDown&&dragStatus!=false)
   				{
   					updatePoint(e);
   					if(self.mousemove_After)
   					{
   						self.mousemove_After(e);
   					}
   					
   				}
   			}
   			self.getPos=function()
   			{
   				return {y:lastElemTop,x:lastElemLeft};
   			};
   			self.setPos=function(_x,_y)
   			{
   				lastElemTop=_y;
                lastElemLeft=_x;
   			};
   			self.init=function(){
   			    if(self.handler){
   			    	self.handler.mousedown(self_mousedown);
   			    }else
   			    {
				  self.css("position","absolute");
   			      self.mousedown(self_mousedown);
   			    }
   			    
   			    $(document).bind("mouseup",document_mouseup);
   			    $(document).bind("mousemove",document_mousemove);
   			};
   			return self;
   		}
   	});
	/**
	 * 显示提示框
	 */
	$.extend({
		showMsgBox : function(msg)
		{
			layer.msg(msg, {icon: 1});
		}
	});
	
	$.extend({
		showConfirmBox : function(msg, callback)
		{
			layer.confirm(msg, {
			  title:'提示',
			  icon: 3, 
			  btn: ['确定','取消'] //按钮
			}, 
			function(){
			  callback();
			}, 
			function(index){
			   layer.close(index);
			});
		}
	}); 
	
	$.extend({
		"s2.ui.Dialog" : function()
		{
			var self = {};
			
			var index = 0;
			
			var options = null;
			
			self.init = function()
			{
				options = {
					  type: 1,
					  zIndex:9999,
					  skin: 'layui-layer-rim', //加上边框
					  area: [self.width || '500px', self.height || '300px'],
					  btn: ['确定', '取消'],
					  yes: function(index, layero){
						  if(self.yesBtnClick){
							  self.yesBtnClick();
						  }
					  },
					  btn2: function(index, layero){
						  layer.close(index);
					  },
					  content: $(self.contentId)
				}
			}
			
			self.setContent = function(html)
			{
				$.extend(options, {content:html});
			}
			
			self.setContentId = function(id)
			{
				options.content = $(id);
			}
			
			self.show = function(title)
			{
				if($.trim(title)){
					options.title = title;
				}
				index = layer.open(options);
			}
			
			self.close = function()
			{
				layer.close(index);
			}
			
			return self;
		}
	});
	
	/**
	 * xml转json
	 */
	$.extend({
		toJson : function(xml)
		{
		   var json = {};
		   xml.children().each(function(i){
	           var col = $(this);
	           json[col.context.nodeName] = col.text();
           });
           return json;
		}
	});
	
    /**
     * 初始化页面组件，初始化成功后调用callback回调方法
     */
    $.extend({
       compCheck:function(node, callback,s2type)
       {
           var compname = node.attr("s2-comp");
           var config =  S2_Comps[compname];
		   if(s2type){
			   compname=node.attr("s2-type");
			   config=S2_Type[compname];
		   }

           if(!config)
           {
               alert(compname+"没有配置");
               return;
           }
		   
		   

	   	if (config.extend) {
				   
				for ( var e in config.extend) {
					var exjs = config.extend[e];
					var extcomp = S2_Comps[exjs];
					if (!extcomp["loaded"]) {
						//alert(extcomp.url);
						//$.cssLoad(extcomp.css);
						if(extcomp.css){
					        $.cssLoad(extcomp.css);
				        }
						$.jsScript(extcomp.url, function(d) {
							extcomp.loaded = true;
						});
					}
	
				}
				
			}
           
           if(!config.loaded)
           {
			  // setTimeout(function(){},1000);
                if(!config.url)
                {
                    alert(compname+"没有配置url属性");
                }
                if(config.css){
					$.cssLoad(config.css);
				}
				
                $.jsScript(config.url,function(){
                    var comp = node[compname]();
					function compinit(){
						    comp.init();
							config.loaded = true;
							if(callback)
		                    {
		                       callback();
		                    }
					}
					//如果组件中标示使用插件，必须现调用完插件后，执行初始化方法
					if(comp.useplugin){
						$.usePlugin(comp.useplugin,function(){
							compinit();
						});
					}else{
						compinit();
					}
                   
                });
           }
           else
           {
			   //alert(compname);
               var comp = node[compname]();
               comp.init();
			   if(callback)
               {
				  callback();
               }
			   
           }

           
       }
    });

    /**
     * 加载js文件，加载成功之后，调用_success方法
     *
     * 参数说明：
     * _url:请求js url地址
     * _success:请求成功回调方法
     */
    $.extend({
        jsScript:function(_url,_success){
			//setTimeout(function(){},10);
            $.ajax({url:_url,dataType:"script",cache:false,async:false}).always(_success);
        }
    });

    /**
     * 导入UI组件
     */
	$.extend({
		jsImport : function(compname, param,success) {
			var compConfig = S2_Comps[compname];
			if (!compConfig) {
				S2_Comps[compname] = param;
				compConfig = S2_Comps[compname];
			}
			if (!compConfig["loaded"]) {
				$.jsScript(compConfig.url, function() {
					compConfig.loaded = true;
					if(success){
						success();
					}
				});
			}
		}
	});
	
	/**
	 *  使用插件
	 *  @plugin 插件的数组
	 *  @fn 插件加载完成后调用
	 */
	$.extend({
		usePlugin:function(plugin,fn){
			//S2_Plugin
			function loadplugin(i){
				var comp=S2_Plugin[plugin[i]];
				//console.log(comp);
				
				if(!comp){
				  console.error(plugin[i]+"未定义");	
				  return;
				}
				if(!comp.loaded){
					  if(comp.css){
					        $.cssLoad(comp.css);
				      }
					  $.jsScript(comp.url, function() {
						  i=i+1;
						  comp.loaded=true;
						  if(i<plugin.length){
							    
								loadplugin(i);
						  }else{
							 if(fn){
								fn();
							 }						
						  }
			        });	
								
				}else{
					i=i+1;
					
					if(i<plugin.length){
						loadplugin(i);
				    }else{
						 if(fn){
							fn();
						 }						
					}
				}
				
			}
			loadplugin(0);
			
		}
	});
	
	/**
	 * 加载html
	 */
	$.extend({
		loadHtml : function(_url, _success) {
			$.ajax({
				url :  _url,
				dataType : "html",
				cache : false,
				async : false,
				success : _success
			});
		}

	});
    /**
     * ajax数据访问组件
     *
     * 属性说明：
     * url:请求数据地址
     * data:url参数
     * success:请求成功回调函数，可以是函数数组，其中该方法data参数是返回的xml格式数据
     * async:是否是异步请求，默认值：true
     *
     * 方法说明：
     * load:请求数据
     */
    $.extend({
        "sender2.ds" : function() {
            var self = {};
            self.data="";
            self.success=[];
            self.async = true;

            /**
             * 请求数据
             */
            self.load = function() {
                $.ajax({
                    url : self.url,
                    type : "POST",
                    data : self.data,
                    async : self.async,
                    dataType : "xml",
                    success : function(data) {
                        var xmldata=$(data);
                        for(fun in self.success)
                        {
                            self.success[fun](xmldata);
                        }
                    },
					beforeSend:function(){
						if(self.loadBefore){
							self.loadBefore();
						}
					}
                });
            };

            return self;
        }
    });

    /**
	 * 递归扫描组件，可以控制加载顺序
	 * @comps 选择器查找的组件
	 * @fn 回调加载完成后需要执行的方法
	 * @s2type false 加载组件，true 加载s2type的内容
	 */
    $.extend({
		"s2.core.scanComp":function(comps,fn,s2type){
			var self={};			
			/**
			 * 递归加载，第一个加载完成后在加载另一个，直到加载完毕
			 */
			function loadcomp(i){
				//alert(comps.length);
				$.compCheck($(comps[i]), function(){
					i=i+1;
					if(i<comps.length){
						loadcomp(i);
					}else{
						if(fn){
							fn();
						}						
					}
				},s2type);
			}
			if(comps.length>0){
				loadcomp(0);
			}else{
				if(fn){
				   fn();
				}
			}			
			return self;
		}
	});

    $.fn.extend({
		"s2.core.CustomComp" : function() {
			var self = this;
		
			function loadCurr(){
				$.jsScript(self.attr("s2-url"), function(){
					       var comp = self[self.attr("s2-comp-name")]();
						   self.data("comp", comp);
				           comp.init();
						   
						   setTimeout(function(){
							     bodysize();
						   },10);
				});
			}
			
			self.init = function() {				
			   $["s2.core.scanComp"](self.find("[s2-comp]"),loadCurr);
			};

			return self;
		}
	});
    
    $.fn.extend({
        "s2.core.include" : function() {
            var self = this;

            self.init = function() {
                var url = self.attr("s2-url");
                if(!url){
                    alert("页面包含组件没有指定url");
                    return;
                }
                $.ajax({ url:  url, dataType:"html", async:false, success: function(html){
                    var obj = $(html);
                    self.after(obj);
                    obj.find("[s2-comp]").each(function(){
                        $.compCheck($(this), null);
                    });
                    self.remove();
                }});
            };

            return self;
        }
    });
	
	$.extend({
		doLayout:function(select){
			//console.log(select);
			select.each(function(){
			  var comp=$(this).data("comp");
			  //alert("dd");
			  if(comp&&comp.doLayout){
				  comp.doLayout();
			  }
		});
		}
	})
	
	function bodysize(){
		var body=$("body");
		//alert(window.outerHeight);
		body.css("height",window.innerHeight+"px");
		$.doLayout(body.find("div:first").find("[s2-comp]"));
	}
	
	$(window).resize(function(e){
		bodysize();
	})

})(jQuery);
