(
	function ($) {
		$.fn.extend(
			{
				"page": function () {
					var self = this;
					self.init = function () {
						//alert("初始化page");
					}
					return self;
				}
			});
	}

)(jQuery);
