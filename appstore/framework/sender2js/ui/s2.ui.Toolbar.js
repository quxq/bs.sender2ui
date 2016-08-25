(function($){
	$.fn.extend({
		"s2.ui.Toolbar":function(){
			var self=this;
			self.init=function(){
				self.css("margin-top","7px")
			}
			self.distroy=function(){
				self.remove();			
				delete self;
		    };
			self.add=function(id,text,_click){
				var btn=$('<button type="button" class="btn btn-default btn-sm" style="margin-left:7px;"><i class="fa fa-plus fa-1x"></i>'+text+'</button>');
				btn.on("click",_click);
				self.append(btn);
			}
			self.data("comp",self);
			return self;
		}
	});
})(jQuery);