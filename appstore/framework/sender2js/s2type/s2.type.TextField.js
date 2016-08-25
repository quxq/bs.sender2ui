(function($){
	$.fn.extend({
		"s2.type.TextField":function(){
			var self=this;
			var input;
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
				//self.attr("class","textfield");
				input=$('<input type="text" name="'+self.attr("s2-name")+'" class="textfield"></input>')
				self.append(input);
			};
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);