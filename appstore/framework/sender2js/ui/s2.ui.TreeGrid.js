(function($){
	$.fn.extend({
		"s2.ui.TreeGrid":function()
		{
			var self=$(this)["s2.ui.DataGrid"]();
			self.lock={row:0,col:2};
			self.mapcol={id:"id",parentid:"1",label:"name"};
			self.changeMapCol=function(_id,_parentid,_label){
				self.mapcol={id:_id,parentid:_parentid,label:_label};
				self.treeview.changeMapCol(self.mapcol.id,self.mapcol.parentid,self.mapcol.label);
			};
			
			self.isCheckBox=true;
			self.header=["name","contract_amount","inner_amount","inner_money","work_list","unit","parent_item_id","price","construction_id","contract_money"];
			self.headerText=["name","contract_amount","inner_amount","inner_money","work_list","单位","parent_item_id","price","construction_id","contract_money"];
			self.headerWidth=[350,100,100,100,350,100,100,100,100,100];
			self.headerRender={};
			self.readyCol=[];
			self.openNodeCol=[];
			self._selectedOneRow=null;
			self._treedata={};
            self.treefield="";
			
		
			var renderCellC={};//渲染器容器
			
			self.addRenderCell=function(field,fun){
				renderCellC[field]=fun.call;
			}
			
			function renderCell(row,field,t,p){
				//console.log(row[field]);
				if(renderCellC[field]){
					renderCellC[field](row,field,t,p);
				}else{
					//console.log(t);
					t.append(row[field]+"");
				}
			
			}
		
			
			self.getSelectedOneRow=function(){
				return self._selectedOneRow;
			};
			
			self.getSelectedOneData=function(){
				if(self._selectedOneRow){
					return self._selectedOneRow.data("row");
				}else
				{
					return false;
				}
				
			};
			
			//全选
			self.checkedAll = function(){
				self.treeview.checkedAll();
			}
			
			//选择全部取消
			self.uncheckedAll = function(){
				self.treeview.uncheckedAll();
			}
			
			//选择指定的项目
			self.selectItem = function(ids){
				self.treeview.selectItem(ids);
			} 
			
			//取消选择指定项目
			self.unselectItem = function(ids){
				self.treeview.unselectItem(ids);
			}
			
			//获取没有选择行
			self.getUnCheckedRow = function(){ 
				return self.treeview.getUnCheckedRow();
			}
			
			self.getRowCount = function(){
				return self.treeview.getRowCount();
			}
			
			function selectedRow()
			{
				var t=$(this);
				self.find("tr").removeAttr("class");
				self.find("tr[id='"+t.attr("id")+"']").attr("class","active");
				self._selectedOneRow=t;
				//alert("");
				if(self.selectedRow){
					self.selectedRow(t.data("row"));
				}
			}
			
			function openEdit(t){
				var nat="";
				for(var s=0;s<self.readyCol.length;s++){
					
					nat+="[col!='"+self.readyCol[s]+"']";
				}
				
				t.find("[readonly='true']"+nat).removeAttr("readonly");
			}
			
			/**
			 * 展开和加载节点
			 */
			self.expend=function(node){
				var t=node;
				var span="";
				var currid=t.attr("id").substr(2);
			
				if(!t.is("[load]")){
					var pl=t.find("div[col='"+self.treefield+"'] span").length+1;
					for(var a=0;a<pl;a++)
					{
						
						if(a==pl-1)
						{
							if(self.isCheckBox){
								span+='<span style="float:left;" class="icon checkbox"/>';
							}
							span+='<span style="float:left;" class="icon forder"></span>';
						}else if(a==pl-2) {
							span+='<span style="float:left;" class="icon t-point"></span>';
						}else
						{
							span+='<span style="float:left;" class="icon space"></span>';
						}
					}
					
					//span+='<span style="float:left;" class="icon"></span>';
					var n=self.treeview.datapool[currid];
					var ready="";
					if(!n){
						t.find(".forder").attr("class","icon leaf");
						t.find(".t-point").attr("class","icon space");
						openEdit(t);
						return;
					}else{
						ready="readonly=true";
					}					
					for(var i in n){
						
						 if(self.leftlength!=0&&t.attr("ly")=="left"){
								var subnode=$('<tr id="t_'+n[i][self.mapcol.id]+'" class="fouder" parentid="'+t.attr("parentid")+","+n[i][self.mapcol.parentid]+'"></tr>');
								
								for(var ci=0;ci<self.leftlength;ci++){
									if($.inArray(self.header[ci],self.openNodeCol)!=-1){
										ready="";
									}else{
										ready="readonly=true";
									}
									if(self.header[ci]==self.treefield){
										//subnode.append('<td class="cl" ><div col="'+self.header[ci]+'" '+ready+' style="width:'+(self.headerWidth[ci]-2)+'px;overflow:hidden;"><div class="t-close" style="white-space:nowrap;width:1000px;height:16px;margin-top:3px;" >'+span+'<a href="javascript:void(0)" class="node">'+renderCell(n[i],self.mapcol.label)+'</a></div></div></td>');
				                        var td=$("<td></td>");
										var d=$('<div col="'+self.header[ci]+'"  '+ready+'></div>');									
										td.append(d);
										d.width(self.headerWidth[ci]-2);
										subnode.append(td);
										var a=$('<a href="javascript:void(0)" class="node"></a>');
										d.append($('<div class="t-close" style="white-space:nowrap;width:1000px;" >'+span+'</div>').append(a));
										
										renderCell(n[i],self.header[ci],a,self);
									}else{
										var td=$("<td></td>");
										subnode.append(td);
										td.width(self.headerWidth[ci]);
										var d=$('<div col="'+self.header[ci]+'"  '+ready+'></div>');
										//console.log("huoqu:"+d);
										td.append(d);
										d.width(self.headerWidth[ci]-2);
										
										
										renderCell(n[i],self.header[ci],d,self);
									}
									
								}	
								
								subnode.data("row",n[i]);
								if(!self.newdata[n[i][self.mapcol.id]])
								{
									//n[i].parentData=t.data("new-row");
									//n[i].parentData.subData.push(n[i]);
									//n[i].status=self.status;
									//n[i].subData=[];
									self.newdata[n[i][self.mapcol.id]]=$.extend(true, {}, n[i]);
									//n[i].parentData.subData.push(self.newdata[n[i][self.mapcol.id]]);
								}
								subnode.data("new-row",self.newdata[n[i][self.mapcol.id]]);
								subnode.insertAfter(t);
								if(n[i].isleaf==1){
									openEdit(subnode);
									subnode.find(".forder").attr("class","icon leaf");
									subnode.find(".t-point").attr("class","icon space");
									
								}
								subnode.css("display","block");
								subnode.attr("ly","left");
								if(self.allexpend){
									subnode.find(".t-close").attr("class","t-open");
									subnode.attr("expend","true");
									
									self.expend(subnode);
								}
							
						};
						
						if(self.rightlength!=0&&t.attr("ly")=="right"){
							var subnode=$('<tr id="t_'+n[i][self.mapcol.id]+'" class="fouder" parentid="'+t.attr("parentid")+","+n[i][self.mapcol.parentid]+'"></tr>');
							
							for(var ci=self.leftlength;ci<self.header.length;ci++){
								if($.inArray(self.header[ci],self.openNodeCol)!=-1){
									ready="";
								}else{
									ready="readonly=true";
								}
								if(self.header[ci]==self.treefield){
									var td=$("<td></td>");
									//subnode.append('<td class="cl" ><div col="'+self.header[ci]+'" '+ready+' style="width:'+(self.headerWidth[ci]-2)+'px;overflow:hidden;"><div class="t-close" style="white-space:nowrap;width:1000px;height:16px;margin-top:3px;" >'+span+'<a href="javascript:void(0)" class="node">'+renderCell(n[i],self.mapcol.label)+'</a></div></div></td>');
			                          var d=$('<div col="'+self.header[ci]+'"  '+ready+'></div>');									
										td.append(d);
										d.width(self.headerWidth[ci]-2);
										subnode.append(td);
										var a=$('<a href="javascript:void(0)" class="node"></a>');
										d.append($('<div class="t-close" style="white-space:nowrap;width:1000px;" >'+span+'</div>').append(a));
										
										renderCell(n[i],self.header[ci],a,self);
								}else{
									var td=$("<td></td>");
									td.width(self.headerWidth[ci]);
									subnode.append(td);
									
									var d=$('<div col="'+self.header[ci]+'"  '+ready+'></div>');
									//console.log("huoqu:"+d);
										td.append(d);
										d.width(self.headerWidth[ci]-2);
										
									
									renderCell(n[i],self.header[ci],d,self);
								}
							}	
							
							subnode.data("row",n[i]);	
							if(!self.newdata[n[i][self.mapcol.id]])
							{
								//n[i].parentData=t.data("new-row");
								//n[i].parentData.subData.push(n[i]);
								//n[i].status=self.status;
								//n[i].subData=[];
								self.newdata[n[i][self.mapcol.id]]=$.extend(true, {}, n[i]);
								//n[i].parentData.subData.push(self.newdata[n[i][self.mapcol.id]]);
							}
							subnode.data("new-row",self.newdata[n[i][self.mapcol.id]]);
							subnode.insertAfter(t);
							if(n[i].isleaf==1){
								openEdit(subnode);
								subnode.find(".forder").attr("class","icon leaf");
								subnode.find(".t-point").attr("class","icon space");
								
							}
							subnode.attr("ly","right");
							subnode.css("display","block");
							if(self.allexpend){
								subnode.find(".t-close").attr("class","t-open");
								subnode.attr("expend","true");
								
								self.expend(subnode);
							}
							
							//self.rightbody.find("tbody").append(subnode);
						}
						
						
					}
					t.attr("load","true");	
				}
				
				
			};
			
			
			self.itemClick=function(e){
				var t=$(this).parents("tr");
			    //alert(t.attr("id"))
			    if(self.leftlength!=0){
			    	 self.expend(self.leftbody.find("#"+t.attr("id")));	
			    }
			   
				self.expend(self.rightbody.find("#"+t.attr("id")));	
				var currid=t.attr("id").substr(2);
				if(!t.is("[expend]")){
					self.find("[parentid='"+t.attr("parentid")+","+currid+"']").show();
					t.find(".t-close").attr("class","t-open");
					t.attr("expend","true");
				}else{
					t.removeAttr("expend");
					self.find("[parentid*='"+t.attr("parentid")+","+currid+"']").hide().removeAttr("expend").find(".t-open").attr("class","t-close");
					t.find(".t-open").attr("class","t-close");
				};
			};
			
			self.status=function(){
				if(this.parentData){
//					if(!this.parentData.subData){
//						this.parentData.subData=[];
//					}
//					this.parentData.subData.push(this);
					//alert(this.parentData.name);
					this.parentData.status();
					//alert(this.parentData.name);
				}
				
			};
			
			self.parse=function(p){
				
				if(self.leftwidth!=0){
					
					if(!self.leftbody.find("tbody").is("tbody")){
						self.leftbody.append('<table><tbody></tbody></table>');
					}
				}
				
				if(!self.rightbody.find("tbody").is("tbody")){
					self.rightbody.append('<table><tbody></tbody></table>');
				}
				self.leftbody.attr("class","s2treeview");
				self.rightbody.attr("class","s2treeview");
				
				var tbody=self.leftbody.find("tbody");
				var n=self.treeview.datapool[p];
				var ready="";
				if(n){
					ready="readonly=true";
				}else{
					ready="";
				}	
				var span="";
				if(self.isCheckBox){
					span+='<span style="float:left;" class="icon checkbox"/>';
				}
				for(var i in n){
					if(!n[i][self.mapcol.id]){
						n[i][self.mapcol.id]=0;
					}
					
					
                    if(self.leftlength!=0){
                    	var subnode=$('<tr id="t_'+n[i][self.mapcol.id]+'"  parentid="0" style="display: block;" ></tr>');
                    	if(n[i].isleaf==1){
							ready="";
						}
						for(var ci=0;ci<self.leftlength;ci++){
							if($.inArray(self.header[ci],self.openNodeCol)!=-1){
								ready="";
							}else{
								ready="readonly=true";
							}
							if(self.header[ci]==self.treefield){
								
								var td=$("<td></td>");
								var d=$('<div col="'+self.header[ci]+'"  '+ready+'></div>');									
								td.append(d);
								d.width(self.headerWidth[ci]-2);
								subnode.append(td);
								var a=$('<a href="javascript:void(0)" class="node"></a>');
								d.append($('<div class="t-close" style="white-space:nowrap;width:1000px;" ><span style="float:left;" class="icon t-point"></span>'+span+'<span style="float:left;" class="icon forder"></span></div>').append(a));
								
								renderCell(n[i],self.header[ci],a,self);
							  // subnode.append('<td class="cl" ><div col="'+self.header[ci]+'" '+ready+' style="width:'+(self.headerWidth[ci]-2)+'px;overflow:hidden;"><div class="t-close" style="white-space:nowrap;width:1000px;height:16px;margin-top:3px;" ><span style="float:left;" class="icon t-point"></span>'+span+'<span style="float:left;" class="icon forder"></span><a href="javascript:void(0)" class="node">'+renderCell(n[i],self.mapcol.label)+'</a></div></div></td>');
	
							}else{
								var td=$("<td></td>");
								var d=$('<div col="'+self.header[ci]+'"  '+ready+'></div>');									
								td.append(d);
								d.width(self.headerWidth[ci]-2);
								subnode.append(td);
								renderCell(n[i],self.header[ci],d,self);
							}
							
						}
						
						subnode.data("row",n[i]);
						if(!self.newdata[n[i][self.mapcol.id]])
						{
							//n[i].parentData=null;
							//n[i].status=self.status;
							//n[i].subData=[];
							self.newdata[n[i][self.mapcol.id]]=$.extend(true, {}, n[i]);
							
						}
						subnode.data("new-row",self.newdata[n[i][self.mapcol.id]]);
						tbody.append(subnode);

						if(n[i].isleaf==1){
							openEdit(subnode);
							subnode.find(".forder").attr("class","icon leaf");
							subnode.find(".t-point").attr("class","icon space");
							
						}
						subnode.attr("ly","left");
						if(self.allexpend){
							subnode.attr("expend","true").show("fast");
							subnode.find(".t-close").attr("class","t-open");
						
						    self.expend(subnode);
						    
						    
						}
						
					}
					
					
					
					if(self.rightlength!=0){
						var subnode1=$('<tr id="t_'+n[i][self.mapcol.id]+'"  parentid="0" style="display: block;" ></tr>');
					
						for(var ci=self.leftlength;ci<self.header.length;ci++){
							if($.inArray(self.header[ci],self.openNodeCol)!=-1){
								ready="";
							}else{
								ready="readonly=true";
							}
							if(self.header[ci]==self.treefield){
								var td=$("<td></td>");
								var d=$('<div col="'+self.header[ci]+'"  '+ready+'></div>');									
									td.append(d);
									d.width(self.headerWidth[ci]-2);
									subnode1.append(td);
									var a=$('<a href="javascript:void(0)" class="node"></a>');
									d.append($('<div class="t-close" style="white-space:nowrap;width:1000px;" ><span style="float:left;" class="icon t-point"></span>'+span+'<span style="float:left;" class="icon forder"></span></div>').append(a));
									
									renderCell(n[i],self.header[ci],a,self);
							}else{

								var td=$("<td></td>");
								var d=$('<div col="'+self.header[ci]+'"  '+ready+'></div>');
								td.append(d);
								
								d.width(self.headerWidth[ci]-2);
								
								renderCell(n[i],self.header[ci],d,self);
								subnode1.append(td);
							};
						}	
						if(!self.rightbody.find("tbody").is("tbody")){
							self.rightbody.append('<table><tbody></tbody></table>');
						}
						subnode1.data("row",n[i]);
						if(!self.newdata[n[i][self.mapcol.id]])
						{
							//n[i].parentData=null;
							//n[i].status=self.status;
							//n[i].subData=[];
							self.newdata[n[i][self.mapcol.id]]=$.extend(true, {}, n[i]);
						}
						subnode1.data("new-row",self.newdata[n[i][self.mapcol.id]]);
						self.rightbody.find("tbody").append(subnode1);
						if(n[i].isleaf==1){
							openEdit(subnode1);
							subnode1.find(".forder").attr("class","icon leaf");
							subnode1.find(".t-point").attr("class","icon space");
							
						}
						subnode1.attr("ly","right");
						if(self.allexpend){
							subnode1.attr("expend","true").show("fast");
							subnode1.find(".t-close").attr("class","t-open");
							
						    self.expend(subnode1);						    
						}
					}
				}
				
				
				
				
			};
			
			
			
			self.distroy=function(){
				self.remove();			
				delete self;
		    };
			
			function fillleftbody(xml){
				
//				var tbody=self.leftbody.find("tbody");
//				var lasttr=$('<tr style="height:35px;display:block"></tr>');
//				if(self.leftlength!=0){
//					for(var i=0;i<self.leftlength;i++){
//						var td=$("<td></td>");
//						td.width(self.headerWidth[i]);
//						td.html('<div readonly="true"></div>');
//						td.find("div").width(self.headerWidth[i]-2);
//						lasttr.append(td);
//					}	
//					tbody.append(lasttr);					
//				}
				self.leftbody.find("#left_buttom").remove();
				if(!self.autoHeight){
					self.leftbody.append('<div id="left_buttom" style="height:35px">&nbsp;</div>');
				}
				
				self.find(":input[ctype='datepick']").attr("class","Wdate");
				self.find(":input[ctype='datepick']").css("height","25px");
				if(xml.find("row").length>0){
					self.message.hide();
				}else{
//					 if(self.autoHeight){
//	                	 self.css("height","auto");
//	                }
					if(self.autoHeight){
						self.message.css("position","");	
					}
					
					self.message.html("未查找到符合条件的记录！");
					self.message.show();
				}
				self.doLayout();
				if(self.load_After){
					self.load_After(xml);
					
				}
			}
			self.initds=function(){
				
			};
			
			self.getAllData=function(callback){
				var data=[];
				self.rightbody.find("tr").each(function(){
					var t=$(this);
					var row=t.data("row");
					if(row){
						if(callback){
							callback(row);
						}
						data.push(row);
					}
					
				});
				return data;
			};
			
			self.init_After=function()
			{
			//	self.css("overflow","hidden");
				var treefieldIndex=$.inArray(self.treefield,self.header)+1;
				if(self.leftlength!=0&&treefieldIndex<=self.leftlength){
					self.treeview=self.leftbody["s2.ui.TreeView"]();
				}else
				{
					self.treeview=self.rightbody["s2.ui.TreeView"]();
				}			
				self.url=self.attr("s2-url");
				self.treeview.url=self.url;				
				self.treeview.mapcol=self.mapcol;
				self.treeview.parse=self.parse;
				self.treeview.itemClick=self.itemClick;
				self.treeview.allexpend=self.allexpend||false;
				self.treeview.getPnode=function(node){
					return node.parent().parent().parent().parent();
				};
				self.treeview.initItemSelected=function(){
					self.on("click","tr",selectedRow);
				};
				self.treeview.load_After=fillleftbody;
				self.treeview.init();
				if(self.treegrid_initAfter){	
					self.treegrid_initAfter();
				}
				
//				if(self.is("[s2-load]")){				
//					
//					self.load();
//				}
			};
			
			self.getCheckedRow=function(bl){
				return self.treeview.getCheckedRow(bl);
			};
			
//			self.param=function(url,data){
//				self.treeview.url=url;
//				self.treeview.data=data;		
//				
//			};
			
			self.load=function(){
				if(self.rightbody){
					self.leftbody.find("tbody").empty();
					self.rightbody.find("tbody").empty();
				}
				
				self.message.css("position","absolute");
				self.message.css("left","0");
				self.message.css("top","0");
				if(self.autoHeight){
					self.message.css("position","");
				}
				self.message.show();
				self.message.html("数据正在加载中.....");
				self.deletedata={};	
				if(self.url){
					self.treeview.url=self.url;
				}
				if(self.param){
					self.treeview.param=self.param;
				}
				if(self.form){
					//alert(self.form.serialize());
					self.treeview.form=self.form;
				}	
			
				self.treeview.load();
			};
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);