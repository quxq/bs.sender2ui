(function ($) {
	$.fn.extend({
		"s2.ui.Panel": function () {
			var self = this;
			self.childComp = [];
			self.collect = true;
			self.panelroot = null;
			
			self.hide = function () {
				self.panelroot.hide();
			}
			self.show = function () {
				self.panelroot.show();
			}
			self.setTitle = function (text) {
				//alert("dd:"+text);
				if (self.headerTitle) {
					self.headerTitle.html(text);
				}
			};
			
			/**
			 * 面板中使用插件
			 */
			self.ToolBoxPlugin = function (plugn) {

				return self.toolbox[plugn]();
			};
			self.ToolBoxAlign = function (al) {
				if (al == "left") {
					self.toolbox.css("float", "left");
					//self.toolbox.parent().css("text-align","left");
				}
				if (al == "right") {
					self.toolbox.css("float", "right");
					//self.toolbox.parent().css("text-align","right");
				}
				if (al == "center") {
					self.toolbox.parent().css("text-align", "center");
					//self.toolbox.css("margin","0 auto");
				}
			};
			
			self.doLayout=function(){
				var p=self.panelroot.parent();
				if(self.is("[s2-fix='true']")){
					
					self.panelroot.css("height",p.height()-2+"px");
					if(self.header){
						self.css("height",(p.height()-2-self.header.height()-2)+"px");
					}else{
						self.css("height",p.height()-2-2+"px");
					}
					
				}
			}
			self.distroy=function(){
				self.remove();
				self.panelroot.remove();
				delete self;
			}
			self.init = function () {	
				//alert(self.attr("title"));
				//$.Permission();
				//alert("ddd");
				var panelroot = $('<div class="s2-ui-panel"></div>');
				self.wrap(panelroot);
				self.panelroot = self.parent();
				if (self.is('[s2-extcss]')) {
					self.panelroot.attr("style", self.attr("s2-extcss"));
				}
				
				
				//self.css("border","solid 1px #ccc");
				self.collect = self.attr("s2-collect");
				if (self.is("[s2-title]")) {
					self.css("border-top", "none");
					self.header = $('<div class="cl ' + (self.attr("s2-style") || "header") + '"><span id="headtitle">' + self.attr("s2-title") + '</span><div id="toolbox" class="cl"><div id="c" style="display:inline"></div></div></div>')
					self.headerTitle = self.header.find("#headtitle");
					self.toolbox = self.header.find("#c");
					self.header.insertBefore(self);

					if (self.collect) {

						var collect_button = $('<input type="button" value="<<" style="margin:5px;padding:0;width:22px;height:22px;"></input>');
						collect_button.click(function () {
							if (this.value == "<<") {
								self.beforeWidth = self.header.parent().width();

								if (self.collect_CallBack) {
									self.collect_CallBack(true, 25);
								}
							
								collect_button.css("margin", "0");
								self.header.css("border-bottom-width", "0");
								self.headerTitle.hide();
								self.header.parent().width(25);
								self.hide();
								this.value = ">>";
								self.ToolBoxAlign("left");
								self.header.height(self.header.parent().parent().height());
								collect_button.css("margin-top",(self.header.parent().parent().height() / 2 - 11) + "px");

							} else {
								if (self.collect_CallBack) {
									self.collect_CallBack(false, 200);
								}
								self.header.css("border-bottom-width", "1px");
								self.header.parent().css("width", "auto");
								self.show();
								collect_button.css("margin", "5px");
								self.headerTitle.show();
								this.value = "<<";
								self.ToolBoxAlign("right");
								self.header.height("auto");

							}
						});
						self.toolbox.append(collect_button);
						self.ToolBoxAlign("right");
					}
				}
				
				
				
				//alert(self.parentComp.attr("comp"))
				if (self.parentComp) {
					if (self.parentComp.childComp) {
						self.parentComp.childComp.push(self);
					}

				}

				if (self.init_After) {
					self.init_After();
				}

				
				
				if (self.comp_Check_After) {
					self.comp_Check_After();
				}

			};
			self.data("comp", self);

			return self;
		}
	})
})(jQuery);