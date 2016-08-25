(function($){
	/**
	 * Tab页UI组件
	 */
	$.fn.extend({
		"s2.ui.Tab" : function()
		{
			var self = this;
			
			self.init = function()
			{
				self.addClass('nav-tabs-custom')
				    .wrapInner('<div class="tab-content"></div>')
					.prepend('<ul class="nav nav-tabs"></ul>');
				
				var tabs = self.find('.nav-tabs');
				var tabPanels = self.find(".tab-content").children('[s2-title]');
				
				$.each(tabPanels, function(i, tabPanel){
					var active = eval($(tabPanel).attr("s2-active")) || false;
					var title = $(tabPanel).attr("s2-title");
					if(active){
						tabs.append('<li class="active"><a href="#tab_' + i + '" data-toggle="tab" aria-expanded="'+active+'">' + title + '</a></li>');
						$(tabPanel).addClass('tab-pane active').attr('id', 'tab_' + i);
					}else{
						tabs.append('<li><a href="#tab_' + i + '" data-toggle="tab" aria-expanded="'+active+'">' + title + '</a></li>');
						$(tabPanel).addClass('tab-pane').attr('id', 'tab_' + i);
					}
					
				});
				
				tabs.find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
					if(self.shownAfter){
						self.shownAfter($(this).text());
					}
				});
			}
			
			self.data("comp", self);
			
			return self;
		}
	});
})(jQuery);