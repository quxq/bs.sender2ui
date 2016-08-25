(
	function($){
		$.fn.extend({
			"s2.ui.BreadCrumb":function(){
				var self=this;
				var rect;
				self.init=function(){
				    rect=$('<ol class="s2-ui-breadcrumb">'+"</ol>");
					self.empty();
//					rect.append('<li><a href="#">首页</a></li>');
//					rect.append('<li><a href="#">首页1</a></li>');
//					rect.append('<li class="active">首页</li>');
     			    self.append(rect);
				}
				
				self.load=function(ms){
					rect.empty();
					
					for(var i=0;i<ms.length;i++){
						if(i<ms.length-1){
							//alert(ms[i].title);
							rect.append('<li><a href="'+ms[i].href+'">'+ms[i].title+'</a></li>');
						}else{
							rect.append('<li class="active">'+ms[i].title+'</li>');
						}
						//rect.append('<li><a href="'+ms[i].href+'">'+ms[i].title+'</a></li>');
					}
				}
				
			   self.distroy=function(){
					self.remove();
					delete self;
			   }
				
				self.data("comp",self);
				return self;
			}
		});
	}
)(jQuery);