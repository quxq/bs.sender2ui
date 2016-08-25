(function($){
	/**
	 * box UI组件
	 */
	$.fn.extend({
		"s2.ui.Box":function()
		{
			var self = this;
			
			var boxTools = null;
			
			self.init = function()
			{
				self.addClass("box").wrapInner('<div class="box-body"></div>');
				
				if($.trim(self.attr("s2-title"))){
					self.title = $.trim(self.attr("s2-title"));
					
				}
				
				if(eval($.trim(self.attr("s2-tools")))){
					self.tools = eval($.trim(self.attr("s2-tools")));
				}
				
				if(self.title){
					 self.prepend('<div class="box-header with-border">'
				                + '<h3 class="box-title">' + self.title + '</h3>'
				                + '</div>');
					 
					 if(self.tools){
					 	self.find(".box-header").append('<div class="box-tools"></div>');
						boxTools = self.find(".box-tools");
					}
				}
			}
			
			self.setTools = function(html)
			{
				boxTools.html(html);
			}
			
			self.data("comp", self);
			
			return self;
		}
	});
})(jQuery);