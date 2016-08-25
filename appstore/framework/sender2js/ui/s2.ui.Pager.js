(function($){
	/**
	 * 分页UI组件
	 */
	$.fn.extend({
		"s2.ui.Pager" : function()
		{
			var self = this;
			
			//每页显示记录条数，默认显示10条
			self.pageSize = 10;
			
			//绑定表单
			self.form = null;
			
			//是否加载数据，默认加载数据
			self.autoLoad = true;
			
			//数据源
			var ds = null;
			var datagrid = null;
			//总记录数，默认0
			var totalRecord = 0;
			//总页数，默认0
			var totalPage = 0;
			//当前页，默认是首页
			var curPage = 1;
			
			//每页显示下拉框
			var pageSizeSel = null;
			//跳转到指定页下拉框
			var turnToPageSel = null;	
			
			//首页按钮
			var firstPageBtn = null;
			//上页按钮
			var prePageBtn = null;
			//下页按钮
			var nextPageBtn = null;
			//尾页按钮
			var lastPageBtn = null;
			
			
			//总记录数文本
			var totalRecordText = null;
			//总页数文本
			var totalPageText = null;
			//当前页文本
			var curPageText = null;
			
			//保存开始记录
			var startnumInput = null;
			//保存结束记录
			var endnumInput = null;
			
			self.init = function()
			{
				self.addClass("pager")
					.append(
						  '<li>'
						  + '每页显示<select id="pageSize">'
						  + '<option>10</option>' 
						  + '<option>15</option>'
						  + '<option>20</option>'
						  + '<option>25</option>'
						  + '<option>30</option>'
						  + '</select>条'
						  + '</li> '
						  +	'<li><a href="javascript:void(0);" id="firstPage"><i class="glyphicon glyphicon-step-backward"></i>首页</a></li> '
						  + '<li><a href="javascript:void(0);" id="prePage"><i class="glyphicon glyphicon-backward"></i>上页</a></li> '
						  + '<li><a href="javascript:void(0);" id="nextPage">下页<i class="glyphicon glyphicon-forward"></i></a></li> '
						  + '<li><a href="javascript:void(0);" id="lastPage">尾页<i class="glyphicon glyphicon-step-forward"></i></a></li> '
						  +	'<li>'
						  + '总条数：<span id="totalRecord" style="border:none;padding:0;"></span> '
						  +	'总页数：<span id="totalPage" style="border:none;padding:0;"></span> '
						  +	'当前页：<span id="curPage" style="border:none;padding:0;"></span>'
						  + '</li> '
						  + '<li>跳转到：<select id="turnToPage"></select>页</li>'
					);
				
				pageSizeSel = self.find("#pageSize");
				turnToPageSel = self.find("#turnToPage");
				
				totalRecordText = self.find("#totalRecord");
				totalPageText = self.find("#totalPage");
				curPageText = self.find("#curPage");
				firstPageBtn = self.find("#firstPage");
				prePageBtn = self.find("#prePage");
				nextPageBtn = self.find("#nextPage");
				lastPageBtn = self.find("#lastPage");
				
				
				//选中每页显示记录数
				pageSizeSel.val(self.pageSize);
				//设置总记录数
				totalRecordText.text(totalRecord);
				//设置总页数
				totalPageText.text(totalPage);
				//设置当前页
				curPageText.text(curPage);
				
				//绑定事件
			    bindEvents();
			    
			    //绑定表单
			    bindForm();
			    
			    //绑定数据源
			    bindDs();
			    
			    if(eval($.trim(self.attr("s2-autoLoad")))){
			    	datagrid.load();
			    }
			    
			}
			
			/**
			 * 绑定事件
			 * @returns
			 */
			function bindEvents()
			{
				pageSizeSel.on("change",pageSizeSel_Change);
				turnToPageSel.on("change",turnToPageSel_Change);
				
				firstPageBtn.on("click",firstPageBtn_Click);
				prePageBtn.on("click",prePageBtn_Click);
				nextPageBtn.on("click",nextPageBtn_Click);
				lastPageBtn.on("click",lastPageBtn_Click);
			}
			
			/**
			 * 绑定的表单
			 * @returns
			 */
			function bindForm()
			{
				 if($.trim(self.attr("s2-ds"))){
					 self.form = $($.trim(self.attr("s2-form")));
					 self.form.append('<input type="hidden" name="startnum"/>'
							 		+ '<input type="hidden" name="endnum"/>'
					 );
					 startnumInput = self.form.find("input[name='startnum']");
					 endnumInput = self.form.find("input[name='endnum']");
					 
					 setPageParam();
				 }else{
				     $.showMsgBox("s2.ui.Pager组件需要指定s2-form属性");
				 }
			}
			/**
			 * 绑定数据源
			 * @returns
			 */
			function bindDs()
			{
				 if($.trim(self.attr("s2-ds"))){
					    datagrid = $($.trim(self.attr("s2-ds"))).data("comp");
					    datagrid.form = self.form;
					    
				    	ds = datagrid.getDs();
				    	ds.success.push(function(data){
				    		totalRecord = data.find("datagrid").attr("rowcount") || 0;
				    		
				    		if(totalRecord == 0){
				    			totalRecord = data.find("row").length;
				    		}
				    		
				    		var newTotalPage = Math.ceil(totalRecord / self.pageSize);
							
							totalRecordText.text(totalRecord);
							totalPageText.text(newTotalPage);
							
							if(totalPage != newTotalPage){
								totalPage = newTotalPage;
								turnToPageSel.empty();
								
								for(var i=1; i<=totalPage; i++){
									turnToPageSel.append('<option>'+i+'</option>');
								}
							}
							
							
							
							firstPageBtn.parents("li").removeClass("disabled");
							prePageBtn.parents("li").removeClass("disabled");
							nextPageBtn.parents("li").removeClass("disabled");
							lastPageBtn.parents("li").removeClass("disabled");
							
							if(totalRecord == 0){
								pageSizeSel.attr("disabled","disabled");
								turnToPageSel.attr("disabled","disabled");
							}else{
								pageSizeSel.removeAttr("disabled");
								turnToPageSel.removeAttr("disabled");
							}
							
							if(totalPage < 2){
								firstPageBtn.parents("li").addClass("disabled");
								prePageBtn.parents("li").addClass("disabled");
								nextPageBtn.parents("li").addClass("disabled");
								lastPageBtn.parents("li").addClass("disabled");
							}else{
								if(curPage == 1){
									firstPageBtn.parents("li").addClass("disabled");
									prePageBtn.parents("li").addClass("disabled");
								}else if(curPage == totalPage){
									nextPageBtn.parents("li").addClass("disabled");
									lastPageBtn.parents("li").addClass("disabled");
								}
							}
								
				    	});
				    }else{
				    	alert("s2.ui.Pager组件需要指定s2-ds属性");
				    }
			}
			
			/**
			 * 设置分页参数
			 * @returns
			 */
		    function setPageParam()
		    {
			    var endnum = self.pageSize * curPage;
			    var startnum = endnum - self.pageSize + 1;
			   
			    startnumInput.val(startnum);
			    endnumInput.val(endnum);
		    }
		
			/**
			 * 首页点击
			 * @returns
			 */
			function firstPageBtn_Click()
			{
			    if(curPage > 1){
				   curPage = 1;
				   goToCurPage();
			    }
			}
			
			/**
			 * 上页点击
			 * @returns
			 */
			function prePageBtn_Click()
			{
				 if(curPage > 1){
					curPage -= 1;
					goToCurPage();
				 }
			}
			
			/**
			 * 下页点击
			 * @returns
			 */
			function nextPageBtn_Click()
			{
				
				 if(curPage < totalPage){
					curPage += 1;
					goToCurPage();
				 }
			}
			
			/**
			 * 尾页点击
			 * @returns
			 */
			function lastPageBtn_Click()
			{
				 if(curPage < totalPage){
					curPage = totalPage;
					goToCurPage();
				 }
			}
			
			/**
			 * 每页显示选择
			 * @returns
			 */
			function pageSizeSel_Change()
			{
				 curPage = 1;
				 self.pageSize = $(this).val();
				 turnToPageSel.val(curPage);
				 goToCurPage();
			}
			
			/**
			 * 跳转到某页选择
			 * @returns
			 */
			function turnToPageSel_Change()
			{
				 curPage = $(this).val();
				 goToCurPage();
			}
			 
			/**
			 * 跳转到当前页
			 * @returns
			 */
		    function goToCurPage()
		    {
		    	curPageText.text(curPage);
		    	setPageParam();
		    	datagrid.load();
		    }
			
			self.data("comp", self);
			
			return self;
		}
	});
})(jQuery);