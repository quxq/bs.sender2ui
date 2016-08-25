(function($){
	$.extend({
		"s2.validate.empty":function(form,constrol){
			if(constrol.val().length<1){
				constrol.popover({pos:"right",title:"验证",msg:"不能为空！"});
				constrol.attr("class","textfield has-error");
				if(!constrol.parent().find(".fa-info-circle").is(".fa-info-circle")){
					constrol.after('<i class="fa fa-info-circle"></i>');
				}
				
				return false;
			}else{
				constrol.attr("class","textfield");
				constrol.parent().find(".fa-info-circle").remove();
			}
			return true;
		},
		"s2.validate.notchecked":function(form,constrol){
			if(constrol.find("input[type='checkbox']:checked").length<1){
				constrol.popover({pos:"right",title:"验证",msg:"必须选中一个"});
				//constrol.attr("class","checkbox has-error");
				if(!constrol.find(".fa-info-circle").is(".fa-info-circle")){
					constrol.append('<i class="fa fa-info-circle"></i>');
				}
				
				return false;
			}else{
				//constrol.attr("class","checkbox");
				constrol.find(".fa-info-circle").remove();
			}
			return true;
		},
		"s2.validate":function(form,constrol){
			var v=constrol.attr("s2-vali").split(",");
			var bl=true;
			try{
				for(var s in v){
				bl=$["s2.validate."+v[s]](form,constrol);
				if(!bl){
					console.log("验证失败");
				}
			    }
			}catch(e){};
			
			return bl;
		}
	});
	
	$.fn.extend({
		"s2.ui.Form":function(){
			var self=this;
			var loadurl=undefined;
			/**
			 * 验证表单
			 */
			self.validate=function(){
			    var bl=true;
				self.find("[s2-vali]").each(function(){
					bl=$["s2.validate"](self,$(this));// 需要验证的组件
				});
				return bl;
			}
			/**
			 *  指定需要加载远程数据的url
			 */
			self.load=function(url){
				loadurl=url;
			};
			
			/**
			 * 初始化表单
			 */
			self.submit_After=function(){
//				self.find("[s2-name='password']").data("comp").val("哈哈");
				if(self.validate()){
					
				}
				return false;
			};
			/**
			 * 检查表单内是否有组件，如果有赋予改组件的特性
			 */
			self.checkComp=function(fn){
				//检查s2-type 组件
				self.find("s2-type").each(function(){
				    var compel=$(this);
					if(!compel.is("div")){
						console.error(compel.attr("s2-type")+"必须使用div标记");
					}	
				});
				$["s2.core.scanComp"](self.find("[s2-type]"),fn,true);
			};
			
			/**
			 * 改变输入组件的状态
			 */
			function changInputState(){
				//alert("ddd");
			}
			
			/**
			 *   销毁当前表单内所有存在的对象
			 */
			self.distory=function() {
				
			};
			
			self.init=function(){
				self.attr("class","s2-ui-form");
				self.checkComp(function(){
					if(loadurl){
						//执行加载方法
						changInputState();
					}
				});
				self.submit(self.submit_After);
			};
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);