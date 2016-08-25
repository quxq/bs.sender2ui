(function($){
	
	$.fn.extend({
		"s2.type.DateTimePicker":function(){
			var self=this;
			var input;
			self.useplugin=[
			  "bootstrap.timepicker",
			  "bootstrap.timepicker.zh"
			];
			/**
			 * 设置值和获取值
			 */
			self.val=function(s){
				if(!s){
					return getVal();
				}else{
					input.val(s);
				}
			};
			/**
			 * 获取值
			 */
			function getVal(){
				return input.val();
			}
			self.init=function(){

				input=$('<div class="data-time date" data-date="" data-date-format="yyyy-mm-dd">'
					   +'<input size="16" class="textfield" type="text" value=""/>'
					   +'<span class="add-on"><i class="fa fa-calendar"></i></span>'
					   +'</div>');
				
				self.append(input);
				//setTimeout(function() {
				input.datetimepicker({
					language:"zh-CN",
				    autoclose: true,
                    todayBtn: true,
					minView:2,
					startView:2,
					maxView:2,
					pickerPosition:"bottom-left",
					showMeridian:true
		        });
				//},1000);
				
			};
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);