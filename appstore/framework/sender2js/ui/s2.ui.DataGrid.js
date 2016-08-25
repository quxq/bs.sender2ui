(function($){
	
	$.extend({
		"s2.ui.dgrender.link":function(){
		    var self={};
		    /**
		     * 
		     * @param {Object} row 当前行
		     * @param {Object} field 列名
		     * @param {Object} t 列容器
		     * @param {Object} p 表格对象
		     */
		    self.call=function(row,field,t,p){
		       var a=$('<a href="javascript:void(0)">'+row[field]+'</a>');
		       a.click(function(e){
		    	  //alert(p.renderEvent["name"])
		    	    if(p.renderEvent[field]){
		    	    	p.renderEvent[field](row);
		    	    }
		       });
		       t.append(a);
		    }
		    return self;
		}
	});
	
	$.extend({
		"s2.ui.dgrender.worker":function(config){
		    var self={};
		    self.p=null;
		    self.field="";
		    
		    
		    /**
		     * 
		     * @param {Object} row 当前行
		     * @param {Object} field 列名
		     * @param {Object} t 列容器
		     * @param {Object} p 表格对象
		     */
		    self.call=function(row,field,t,p){
		       
		       function bind_click(e){		      
			    	  var t=$(this);
			    	  //alert(field+"."+t.attr("id"));
			    	  if(p.renderEvent[field+"."+t.attr("id")]){
			    		
			    		 //alert(field+"."+t.attr("id"));
		    	    	 p.renderEvent[field+"."+t.attr("id")](row,t);
		    	      }
			   }
		       for(var s in config){
		    	   var a=$('<a href="javascript:void(0)" id="'+config[s].id+'">'+config[s].label+'</a>');
			       a.click(bind_click);
			       t.append(a);
			       t.append("&nbsp;|&nbsp;");
		       }
		       
		      
			   
//		       $.Permission(function(cmd,data){
//			    	if(cmd=="def"){
//			    	   		    		
//			    		t.find("a").css({
//			    			color:"#ccc"
//			    		});
//			    		t.find("a").unbind();
//			    	}
//			    	if(cmd=="open"){
//			    		t.find("a[id='"+data+"']").attr("style","");
//			    		t.find("a[id='"+data+"']").click(bind_click);
//			    	}
//			    });
		       
		    }
		    return self;
		}
	});
	
	$.fn.extend({
		"s2.ui.DataGrid":function()
		{
			var self=$(this);
			var ds;
			self.url="";
			//self.data="";
			self.lock={row:0,col:0};
			self.header=["name","contract_amount","inner_amount","inner_money","work_list","unit","parent_item_id","price","construction_id","contract_money"];
			self.headerText=["name","contract_amount","inner_amount","inner_money","work_list","单位","parent_item_id","price","construction_id","contract_money"];
			self.headerWidth=[350,100,100,100,100,100,100,100,100,100];
			self.alldata;
			self.suportSelect=false;
			self.deletedata={};			
			self.newdata={};
		
			self.draw=function(){
				self.leftlength=self.lock.col;
				self.rightlength=self.header.length-self.leftlength;
				
				self.attr("class","s2datagrid");
                self.append('<div style="position:relative;height:0;width:0;">'+'<div id="message" style="position: absolute;left:0;right:0;font-size:12px;color:#444;text-align:center;background:#fff;z-index:1000">未找到符合条件的数据</div>'+'</div>');
				self.append('<div id="grid_left"  style="float:left;overflow:hidden"> <div id="header" style="overflow:hidden;height:28px;"></div><div id="body"></div></div>');
				self.append('<div id="grid_right" style="float:left;overflow:hidden"> <div id="header" style="overflow:hidden;height:28px;"></div><div id="body"></div></div>');
				self.gridleft=self.find("#grid_left");
				self.gridright=self.find("#grid_right");
				self.leftwidth=0;
				self.rightwidth=0;
				self.message=self.find("#message");
				self.message.width(self.width());
				if(self.leftlength!=0){
				   // var leftwidth=0;
					
					for(var i=0;i<self.leftlength;i++){
						
						self.leftwidth+=self.headerWidth[i];
						
					}	
//					if(self.suportSelect){
//						self.gridleft.width(self.leftwidth+self.leftlength+25);
//					}else{
//						self.gridleft.width(self.leftwidth+self.leftlength+self.lock.col*2);
//					}
					
				}else{
					self.gridleft.hide();
				}
                if(self.rightlength!=0){
                	
					for(var i=self.leftlength;i<self.header.length;i++){
						self.rightwidth+=self.headerWidth[i];
						
					}	
					//self.gridright.width(self.rightwidth);
				}
                self.css("width",(self.width()+2)+"px");
                self.css("height",self.height()+"px");
			};
			
			self.rowAddEvent=function(evt,f){
				//alert(evt)
				function evtcall(){
					
					f($(this).data("row"));
				}
				self.leftbody.on(evt,"tr",evtcall);
				self.rightbody.on(evt,"tr",evtcall);
			}
			
			function selectedRow()
			{
				var t=$(this);
				self.find("tr").removeAttr("class");
				//alert("tobdy tr:eq("+(t.index()+1)+")");
				self.leftbody.find("tr:eq("+(t.index())+")").attr("class","active");
				self.rightbody.find("tr:eq("+(t.index())+")").attr("class","active");
				if(self.selectedRow){
					self.selectedRow(t.data("row"));
				}
			}
			function parseDgPro()
			{
		
				//alert(self.leftwidth)
				var p=self.parent();
				var righteader=self.gridright.find("#header");				
				var leftheader=self.gridleft.find("#header");
				righteader.height(righteader.find("table").height());
				leftheader.height(righteader.find("table").height());
				if(self.width()>leftheader.outerWidth()){
					if(self.is("[fix=true]")){
					   righteader.width(self.width()-leftheader.outerWidth());	
					   self.rightbody.width(self.width()-leftheader.width());	
					}else{
						
					   righteader.width(self.width()-leftheader.outerWidth());	
					   self.rightbody.width(self.width()-leftheader.width());	
					}
				
					//alert((self.width()-leftheader.outerWidth()));	
//					if($.browser.msie6||$.browser.msie7){
//						righteader.width(self.width()-leftheader.outerWidth()+6);	
//						self.rightbody.width(self.width()-leftheader.width()+6);	
//					}
				}
				var _height=self.height()-righteader.height();
				if(self.is("[fix=true]")){
					 _height=self.parent().height()-righteader.height();
					 self.leftbody.height(_height);
					 self.rightbody.height(_height);	
				}		
				
				self.leftbody.height(_height);
				self.rightbody.height(_height);
				//self.leftbody.height(300);
				//self.rightbody.height(300);
			}
			/**
			 * 解析头部
			 */
			function parseHeader(){
				//self.s2script=
			
//				self.header=["name","contract_amount","inner_amount","inner_money","work_list","unit","parent_item_id","price","construction_id","contract_money"];
//				self.headerText=["name","contract_amount","inner_amount","inner_money","work_list","单位","parent_item_id","price","construction_id","contract_money"];
//				self.headerWidth=[350,100,100,100,100,100,100,100,100,100];
				
				
				var leftheader=self.gridleft.find("#header");
				var righteader=self.gridright.find("#header");
				self.headerHeight=leftheader.outerHeight()|righteader.outerHeight();
				if(self.renderHeader){
					self.renderHeader(leftheader,righteader);
					righteader.width(self.width-leftheader.outerWidth());
					self.message.height(100);
					self.message.css("line-height",100+"px");
					self.message.css("top",righteader.outerHeight());
					// parseDgPro();
					return;	
				}
				
				
				if(self.leftlength!=0||self.suportSelect){
					var table=$("<table><thead><tr></tr></thead></table>");
					var tr=table.find("tr");
					if(self.suportSelect){
						tr.append('<td><input id="head_check" type="checkbox"/></td>');
					}
					for(var i=0;i<self.leftlength;i++){
						var td=$("<td></td>");
						td.width(self.headerWidth[i]);
						td.html("<div>"+self.headerText[i]+"</div>");
						td.find("div").width(self.headerWidth[i]-2);
						tr.append(td);
					}	
					leftheader.append(table);
				}
				
				
                if(self.rightlength!=0){
                	var table=$("<table><thead><tr></tr></thead></table>");
					var tr=table.find("tr");
					
					for(var i=self.leftlength;i<self.header.length;i++){
						var td=$("<td></td>");
						td.width(self.headerWidth[i]);
						td.html("<div>"+self.headerText[i]+"</div>");
						td.find("div").width(self.headerWidth[i]-2);
						tr.append(td);
					}	
					righteader.append(table);
					self.scrollbarwidth=righteader.get(0).scrollWidth-self.rightwidth;
					self.lastheaderdiv=$('<td><div style="width:'+self.width()+'px;">&nbsp;</div></td>');
					tr.append(self.lastheaderdiv);
				}
                //self.width(leftheader.outerWidth()+righteader.outerWidth()+2);
                //alert(leftheader.outerWidth());
                righteader.width(self.width-leftheader.outerWidth());
                self.message.height(100);
                self.message.css("line-height",100+"px");
				self.message.css("top",righteader.outerHeight());
                //righteader.find("td:last div").width(righteader.find("td:last").width()+self.scrollbarwidth);
                //console.log(self.scrollbarwidth);
				if(self.suportSelect){
					self.find("#head_check").click(function(){						
					   self.find("#row_check").attr("checked",$(this).attr("checked")?true:false);
					});
				}
                
			}
			
			self.cleardata=function(){
				var leftbody=self.gridleft.find("#body");
				var righbody=self.gridright.find("#body");
				var leftheader=self.gridleft.find("#header tbody");
				var righteader=self.gridright.find("#header tbody");
				//leftbody.hide();
				//rightbody.hide();
				leftheader.empty();
				righteader.empty();
				leftbody.find("#left_buttom").remove();
				leftbody.find("tbody").empty();
				righbody.find("tbody").empty();
			};
			
		    self.renderEvent={};//数据表格中渲染器的回调事件
			var renderCellC={};//渲染器容器
			/**
			 * 添加渲染器
			 * @param {String} field
			 * @param {function(row,field)} fun
			 */
			self.addRenderCell=function(field,fun){
				renderCellC[field]=fun.call;
			}
			
			function renderCell(row,field,t,p){
				if(renderCellC[field]){
					var json={};
			         row.children().each(function(){
			    			var  col=$(this);
			    		json[col.context.nodeName]=col.text();
			    	});
					renderCellC[field](json,field,t,p);
				}else{
					t.append(row.find(field).text());
				}
			
			}
			/**
			 * self.addRenderEvent("字段名或字段名.字段中的控件对象",function(){"行数据"});
			 * @param {Object} evt
			 * @param {Object} f
			 */
			self.addRenderEvent=function(evt,f){
			 
				self.renderEvent[evt]=f;
			}
			/**
			 * 解析行
			 */
			self.parseRow=function(){
				var leftbody=self.gridleft.find("#body");
				var righbody=self.gridright.find("#body");
				var leftheader=self.gridleft.find("#header");
				var righteader=self.gridright.find("#header");
				
				//righbody.width(300);
				righbody.width(self.width-leftheader.outerWidth());
				var table=$("<table><tbody></tbody></table>");
				
				var table1=$("<table><tbody></tbody></table>");
				if(leftbody.find("table").is("table")){
					table=leftbody.find("table");
				}
				if(righbody.find("table").is("table")){
					table1=righbody.find("table");
				}
				var tbody=table.find("tbody");
				var tbody1=table1.find("tbody");
				
				//alert("dd");
				self.alldata.find("row").each(function(rindex){
					var row=$(this);
					var tr=$("<tr></tr>");
					var tr1=$("<tr></tr>");
					var rowobj={};
					row.children().each(function(){
						var c=$(this);
						rowobj[c.context.nodeName]=c.text();
					});
					//parentid.push(rowobj);
					tr.data("row",rowobj);
					tr1.data("row",rowobj);
					if(self.leftlength!=0||self.suportSelect){
						if(self.suportSelect){
							tr.append('<td style="width:20px;"><input id="row_check" type="checkbox"/></td>');
						}
						for(var i=0;i<self.leftlength;i++){
							var td=$("<td></td>");
							td.width(self.headerWidth[i]);
							var d=$("<div></div>");
							td.append(d);
							d.width(self.headerWidth[i]-2);
							renderCell(row,self.header[i],d,self)
							tr.append(td);
						}
						
						if(self.lock.row!=0&&rindex<=self.lock.row-1){
							//执行提取行
							//console.log(rindex);
							if(!leftheader.find("tbody").is("tbody"))
						    {
								leftheader.find("table").append("<tbody></tbody>");
						    }	
							leftheader.find("tbody").append(tr);
						}else{
							 tbody.append(tr);	
						}
						
					}
	                if(self.rightlength!=0){
	                
						for(var i=self.leftlength;i<self.header.length;i++){
//							var td=$("<td></td>");
//							td.width(self.headerWidth[i]);
//							td.html("<div>"+renderCell(row,self.header[i],td)+"</div>");
//							td.find("div").width(self.headerWidth[i]-2);
							var td=$("<td></td>");
							td.width(self.headerWidth[i]);
							var d=$("<div></div>");
							td.append(d);
							d.width(self.headerWidth[i]-2);
							renderCell(row,self.header[i],d,self)
							tr1.append(td);
						}	
						if(self.lock.row!=0&&rindex<=self.lock.row-1){
							if(!righteader.find("tbody").is("tbody"))
						    {
								righteader.find("table").append("<tbody></tbody>");
						    }	
							self.scrollbarwidth=righteader.get(0).scrollWidth-self.rightwidth;
							tr1.append($('<td><div style="width:'+self.scrollbarwidth+self.rightlength+'px;">&nbsp;</div></td>'));
							righteader.find("tbody").append(tr1);
						}else{
							 tbody1.append(tr1);
						}
						
						 
					}
	               
	               
				});
//				var lasttr=$('<tr style="height:'+self.scrollbarwidth+'px"></tr>');
				if(self.leftlength!=0||self.suportSelect){
//					for(var i=0;i<self.leftlength;i++){
//						var td=$("<td></td>");
//						td.width(self.headerWidth[i]);
//						td.html("<div></div>");
//						td.find("div").width(self.headerWidth[i]-2);
//						lasttr.append(td);
//					}	
					//tbody.append(lasttr);
					leftbody.append(table);
					if(!self.autoHeight){
						leftbody.append('<div id="left_buttom" style="height:35px">&nbsp;</div>');
					}
				}
				if(self.rightlength!=0){
				   righbody.append(table1);
				}
				
				leftbody.height(self.height-righteader.outerHeight()-2);
				righbody.height(self.height-righteader.outerHeight()-2);
			};
			
			self.doLayout=function()
			{
				
				if(self.is("[s2-fix='true']")){
					
					var p=self.parent();
					p.css("overflow","hidden");
					//alert(p.attr("region"));
					//alert(p.height());
					var hmargin=0,vmargin=0;
					if(self.is("[s2-hmargin]")){
						hmargin=self.attr("s2-hmargin");
					}
					if(self.is("[s2-vmargin]")){
						vmargin=self.attr("s2-vmargin");
					}
					self.css("margin-top",vmargin+"px");
					self.css("margin-buttom",vmargin+"px");
					self.css("margin-left",hmargin+"px");
					self.css("margin-right",hmargin+"px");
					self.width(p.width()-4-hmargin*2);					
					self.height(p.height()-2-vmargin*2);
					//self.css("border","none");
					//self.css("border-right","none");
					self.message.width(p.width());
					//self.css("overflow","auto");
					//alert("dd");
					if(self.lastheaderdiv){
						self.lastheaderdiv.find("div").width(self.width());
					}
					parseDgPro();
				}else{
					//var p=self.parent();
					self.css("overflow","hidden");
					
					self.css("border-left","none");
					self.css("border-right","none");
					self.message.width(self.width());
					//self.css("overflow","auto");
					//alert("dd");
					if(self.lastheaderdiv){
						self.lastheaderdiv.find("div").width(self.width());
					}
					parseDgPro();
				}
			};
			
			
			
			/**
			 * 初始化数据源
			 */
			self.initds=function(){
				
				ds=$["sender2.ds"]();
				ds.url=self.url||self.attr("s2-url");
				//ds.data=self.param||self.attr("param");
				ds.loadBefore=function(){
					
					self.cleardata();
				    self.message.html("数据正在加载中.....");
				    self.message.show();
				    self.deletedata={};
				}
				ds.success=[function(xml){
					
					self.alldata=xml;
					self.parseRow();
					if(xml.find("row").length>0){
						self.message.hide();
					}else{
						self.message.html("未查找到符合条件的记录！");
						self.message.show();
					}
					self.doLayout();
					if(self.load_After){
						self.load_After(xml);
					}
				}];
			};
		
			
	        self.getEditRow=function(){
	        	var editrow={};
	        	self.find("tr").has("td[isEdit='true']").each(function(){
	        		var t=$(this);
	        		editrow[t.attr("id")]=t.data("new-row");
	        	});
	        	var r=[];
	        	for(var s in editrow){
	        		r.push(editrow[s]);
	        	}
	        	return r;
	        };
	        
	        self.hasError=function(){
	        	return self.find("td[error='true']").length>0;
	        };
	        
	        self.getAddRow=function(){
	        	var editrow={};
	        	self.find("tr[add='true']").each(function(){
	        		var t=$(this);
	        		editrow[t.attr("id")]=t.data("new-row");
	        	});
	        	var r=[];
	        	for(var s in editrow){
	        		r.push(editrow[s]);
	        	}
	        	return r;
	        };
	        
	        self.getDeleteRow=function()
	        {
	        	var r=[];
	        	for(var s in self.deletedata){
	        		r.push(self.deletedata[s]);
	        	}
	        	return r;
	        };
			
			self.init=function()
			{
				if(!self.s2script){
					//alert("ddd");
					
					self.s2script=self.find("[s2-script]").html();
					self.find("[s2-script]").remove();
					eval(self.s2script);
				}
				self.draw();
				
				//tbody=self.find("tbody");
//                if($.browser.msie6){
//					
//					self.parent().css("position","absolute");
//				};
				
				parseHeader();
				
				self.initds();
					
				self.leftbody=self.gridleft.find("#body");
				self.rightbody=self.gridright.find("#body");
				if(!self.rightbody.find("tbody").is("tbody")){
					self.rightbody.append('<table><tbody></tbody></table>');
				}
				self.righteader=self.gridright.find("#header");
				//parseDgPro();
				self.rightbody.scroll(function(){
					self.leftbody.scrollTop($(this).scrollTop());
					//console.log(self.rightbody.outerWidth()+"||"+self.rightbody.get(0).scrollWidth+"||"+self.righteader.get(0).scrollWidth);
					self.righteader.scrollLeft($(this).scrollLeft());
					//self.righteader.find("table td:last div").width(116);
				});
				//self.treeview.initItemSelected=function(){
				self.on("click","tr",selectedRow);
				//};
				var _bindtarget=bindtarget();
				if(_bindtarget){
					self.form=_bindtarget;
					console.log(self.form);
				}
				if(self.leftbody.mousewheel){
					self.leftbody.mousewheel(function(objEvent, intDelta){
						this.focus();
						
						$(this).scrollTop($(this).scrollTop()-intDelta*100);
						self.rightbody.scrollTop($(this).scrollTop());
						if(self.rightbody.scrollTop()<$(this).scrollTop()){
							$(this).scrollTop(self.rightbody.scrollTop());
						}
						
						
					});
				}
			
				
				if(self.init_After){
					
					self.init_After();
					
				};
				
//				self.find(":input[ctype='text']").die().live("change",function(event){
//					var t=$(this);
//					var td=t.parents("td");
//					
//					if(t.is("[c-vali]")){
//						
//						var regx=window.regExps[t.attr("c-vali")];
//						if(!eval(regx.reg).test(t.val())){							
//							t.val(t.parents("tr").data("new-row")[t.attr("name")]);													
//						}
//					}
//					
//					if(t.parents("tr").data("row")[t.attr("name")]!=t.val()){
//						   t.parents("tr").data("new-row")[t.attr("name")]=t.val();
//						   td.attr("isEdit","true");
//						   t.css("background-color","blue");
//						   t.css("color","#fff");
//					}else
//					{
//						   td.removeAttr("isEdit");
//						   t.css("background-color","");
//						   t.css("color","#000");
//					}
//				});
				
				
//				self.find(":input[ctype='datepick']").die().live("click",function(){
//					  var t=$(this);
//					  var td=t.parents("td");
//					  var df="yyyy-MM-dd HH:00:00";
//					  if(t.is("[df]")){
//						  df=t.attr("df");
//					  }
//					  WdatePicker({dateFmt:df,readOnly:true,onpicked:function(dp){
//						    if(t.parents("tr").data("row")[t.attr("name")]!=t.val()){
//						       t.parents("tr").data("new-row")[t.attr("name")]=t.val();
//							   td.attr("isEdit","true");
//							   t.css("background-color","blue");
//							   t.css("color","#fff");
//							}else
//							{
//							   td.removeAttr("isEdit");
//							   t.css("background-color","");
//							   t.css("color","#000");
//							}
//							  return true;
//						  }});
//				});
				
//				if(self.parentComp.childComp){
//					self.parentComp.childComp.push(self);
//				}
				self.doLayout();
				if(self.is("[s2-load]")){				
					self.load();
				}
				
				
			};
			self.getSelected=function(col){
				//alert(self.leftbody.find("#row_check:checked"));
				var rows=[];
				self.leftbody.find("#row_check:checked").parents("tr").each(function(){
					if(!col){
						rows.push($(this).data("row"));
					}else{
						rows.push($(this).data("row")[col]);
					}
					
				});
				return rows;
			};
			
			/**
			 * 全部选中
			 */
			self.checkedAll = function()
			{
				self.find("#head_check").attr("checked","checked");
				self.leftbody.find("#row_check").attr("checked","checked")
			}
			
			/**
			 * 全部不选中
			 */
			self.uncheckedAll = function()
			{
				self.find("#head_check").removeAttr("checked");
				self.leftbody.find("#row_check").removeAttr("checked");
			}
			
			/**
			 * 选择指定的项目
			 * @param {Object} col 用来比较的字段名称
			 * @param {Object} ids 指定的id数组
			 */
			self.selectItem = function(col,ids)
			{
				var count = 0;
				var myids = ids.slice(0);
				var tr = self.leftbody.find("tr");
				tr.each(function(){
					var row = $(this).data("row");
					for(var i=0;i<myids.length;i++){
						if(row[col] == myids[i]){
							$(this).find("#row_check").attr("checked","checked");
							myids.splice(i,1);
							count++;
						}
					}
				});
				if(count > 0 && tr.length == count){
					self.find("#head_check").attr("checked","checked");
				}
			}
			
			self.getDs=function(){
				return ds;
			};
			
//			self.param=function(url){
//				ds.url=url;
//			};
           function bindtarget(){
				if(self.is("[s2-form]")){
					console.log(self.attr("s2-form"))
				  return  self.parents("[s2-comp]").find(self.attr("s2-form"));
				}
				return undefined;
		    }
			self.load=function()
			{

				
				if(self.param){
					ds.data=self.param;
				}
				
				if(self.form){
					ds.data=self.form.serialize();
				}				
				ds.load();
				
			};
			self.distroy=function(){
				self.remove();
				delete self;
			}
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);