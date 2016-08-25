$.fn.extend( {
	's2.ui.PerPageBar' : function(option) {
		var self =this;
		
		
		//成员变量
        //---------------------------------------------------------------------------
		self.datasource;//数据源	
		self.form;
		self.start=1;
		
		var countrecord=0;//总记录数
		var currpage=1; //当前页
		var pagecount=1;	//总页数
		self.pagesize=15;	//每页显示条数
		//---------------------------------------------------------------------------
		function bindtarget(){
			if(self.is("[s2-bind]")){
				//console.log(self.parents("[s2-comp]").find(self.attr("s2-bind")).attr("s2-comp"));
			 return self.parents("[s2-comp]").find(self.attr("s2-bind")).data("comp");
			}else{
				console.error("分页条必须指定需要分页的组件");
			}
			return undefined;
		}
		self.distroy=function(){
				self.remove();
				
				delete self;
		}
		// 绘制界面
        function draw()
        {
        	var str = ' ';
       		 if(self.style==undefined){
       			  str = ' <dl class="perpagebar">'
       		    +'<dt><button id="homepage" disabled class="btn btn-default btn-sm" value="首页"><i class="fa fa-angle-double-left"></i></button></dt>'
       			+'<dt><button id="prevpage" disabled class="btn btn-default btn-sm" value="上页"><i class="fa fa-caret-left"></i></button></dt>'
       			+'<dt>'
       			+'<select id="pagesize">'  
       			+'<option value="15">15</option>'     
       			+'<option value="25">25</option>'     
       			+'</select>'  
       			+'</dt>'
       			+'<dt><button id="nextpage" disabled class="btn btn-default btn-sm" value="下页"><i class="fa fa-caret-right"></i></button></dt>'
       			+'<dt><button id="lastpage" disabled class="btn btn-default btn-sm" value="尾页"><i class="fa fa-angle-double-right"></i></button></dt>'
       			+'<dt r="info"><label>总记录：</label><span id="totalcount">0</span><label>当页/总页：</label><span id="currpage">1</span> <span>/</span><span id="pagecount">1</span></dt>'
       			+'<dt r="info"><input type="text" id="turnpage" size="5"></input></dt>'
       			+'<dt r="info"><button id="turnto" class="btn btn-default btn-sm"  value="跳转"><i class="fa fa-external-link"></i></button></dt>'
       		  +'</dl>';
       		
       		 }
       		
       		 if(self.style==1){
       			  str = ' <dl>'
       		    +'<dt><input type="button" id="homepage" disabled="true" class="button" style="opacity:.4;width:20px;border:none;background-color:transparent" /></dt>'
       			+'<dt><input type="button" id="prevpage" disabled="true" class="button" style="opacity:.4;width:20px;border:none;background-color:transparent" /></dt>'
       			+'<dt>'
       			+'<select id="pagesize">'  
       			+'<option value="15">15</option>'     
       			+'<option value="25">25</option>'     
       			+'</select>'  
       			+'</dt>'
       			+'<dt><input type="button" id="nextpage" class="button" disabled="true" style="opacity:.4;width:20px;border:none;background-color:transparent;background-position: left 3px;"  /></dt>'
       			+'<dt><input type="button" id="lastpage" class="button" disabled="true" style="opacity:.4;width:20px;border:none;background-color:transparent;background-position: left 3px;" /></dt>'
       			+'<dt><label >总数/当页：</label><span id="totalcount">0</span>/<span id="currpage">1</span> <label style="display:none">总共页：</label><span id="pagecount" style="display:none"></span></dt>'
       			+'<dt style="display:none"><input type="text" id="turnpage" size="5"></input></dt>'
       			+'<dt style="display:none"><input type="button" id="turnto" class="button"  value="跳转"/></dt>'
       		  +'</dl>'
       		  +'<div  style="clear:both"></div>';
       		 }
       		 
       		 self.append(str);
        }
        //---------------------------------------------------------------------------
		self.init=function(){
			   if(!self.s2script){					
					//alert(self.html())
					self.s2script=self.find("[s2-script]").text();
					
					
					eval(self.s2script);
					self.find("[s2-script]").remove();
			   }
			   self.empty();
			   draw();
			   var bind=bindtarget();
			   if(bind){
				  if(bind.form){
					  self.form=bind.form;
					 
				  } 
				 
				  self.datasource=bind.getDs();
			   }
			   self.datasource.success.push(function(xml){
					//alert("分页加载数据："+xml[0].name)		
					var row=xml.find("datagrid");
					var totalcount=row.attr("rowcount");
					dispstate(totalcount);
				});	
			   
			   
			   if(self.form)
			   {
				  if(!self.form.find("[name='startnum']").is("input")){
					  self.form.append('<input type="hidden" name="startnum" value="1"/>');
				  }
				  if(!self.form.find("[name='endnum']").is("input")){
					  self.form.append('<input type="hidden" name="endnum" value="'+self.pagesize+'"/>');
				  }
				  
			   }
			   
			   self.find("#pagesize").val(self.pagesize);
			   
			 //---------------------------------------------------------------------------
				// 对当前页面赋予事件
				
				self.find("#pagesize").on("change",function(){
					//......
					currpage = 1;
					gotoPage(1);
					
					
				});	
				
				//首页按钮事件
				self.find("#homepage").on("click",function(){
					currpage = 1;
					gotoPage(currpage);
							
					
				});		
				
				//上页按钮事件
				self.find("#prevpage").on("click",function(){
					currpage--;
					gotoPage(currpage);			
					
				});
				
				
				
				//下页按钮事件
				self.find("#nextpage").on("click",function(){		
					currpage++;
					gotoPage(currpage);	
					
					
				});
				
				//尾页按钮事件		
				self.find("#lastpage").on("click",function(){
					currpage = $("#pagecount").text();
					gotoPage(currpage);
					
					
				});
				
				//跳转按钮事件		
				self.find("#turnto").on("click",function(){			
					var turnpage = parseInt(self.find("#turnpage").val());//获取输入的跳转值			
					currpage=turnpage;					
					gotoPage(turnpage);
					
				});	
				
				if(self.is("[s2-load]")){				
					gotoPage(1);
				}
				
		};
		
	    //---------------------------------------------------------------------------
		
		/**
		 * 显示分页信息
		 */
		function dispstate(contr)
		{
			countrecord=contr;
			self.pagesize = parseInt($("#pagesize").val());
			
			//计算页数
			pagecount =Math.ceil(countrecord / self.pagesize);
			//设置到界面
			self.find("#pagecount").text(pagecount);
			self.find("#totalcount").text(countrecord);
			self.find("#currpage").text(currpage);	//当前页
			self.find("#turnpage").val(currpage);	//当前页
			//ds.data="";
			perbutton(currpage);
			if(countrecord==0)
			{
				//alert("没有找到该页数据");
				self.find("#nextpage").attr("disabled",true);
				self.find("#lastpage").attr("disabled",true);
			}
		}
		
		function perbutton(page)
		{
			//self.find("#turnto").attr("disabled",false);
			//跳转判断
			if(page<1){
				
				self.find("#homepage").attr("disabled",true);
				self.find("#prevpage").attr("disabled",true);
				return;
			}else{
				self.find("#homepage").attr("disabled",false);
				self.find("#prevpage").attr("disabled",false);
			}
			if(page == 1){
				//alert("已经是首页！");	
				self.find("#homepage").attr("disabled",true);
				self.find("#prevpage").attr("disabled",true);
			}
			if(page>pagecount)
			{
					return;
			}
			//alert(currpage);
			if(page>=pagecount){
				
				self.find("#nextpage").attr("disabled",true);
				self.find("#lastpage").attr("disabled",true);
				//self.find("#turnto").attr("disabled",true);
			}else{
				self.find("#nextpage").attr("disabled",false);
				self.find("#lastpage").attr("disabled",false);
				
			}
			//t.find(":input[type='button']").css("opacity",0.4);
			self.find(":input[disabled='true']").css("opacity",0.4);
			self.find(":input[disabled='false']").css("opacity",1);
		}
		
		function gotoPage(page){
			self.pagesize = parseInt($("#pagesize").val());
			//得到总页数
			var endmum=self.pagesize*page;
			var firstnum=endmum-self.pagesize+1;
			//alert(endmum);
			self.form.find("input[name='startnum']").val(firstnum);
			self.form.find("input[name='endnum']").val(endmum);
			//alert(self.form.find("input[name='startnum']").val());
			self.datasource.data=self.form.serialize();
			self.datasource.load();
			//ds.data+="startnum="+firstnum+"&endnum="+endmum;
			
		}
		
		self.doLayout=function(){
			var p=self.parent();
			//alert("d");
			if(p.width()<300){
				self.find("[r='info']").hide();
			}else{
				self.find("[r='info']").show();
			}
		}
		
		/**
		 * 跳转到该页
		 * @param {Object} page
		 */
		self.topage = function(page)
		{
			currpage = page;
			gotoPage(1);
		}
		
		self.data("comp",self);	
		
		return self;
			
		
	}
	
	

});