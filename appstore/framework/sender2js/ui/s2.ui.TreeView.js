(function ($) {
	/**
	 * 简单树形UI组件
	 */
	$.fn.extend({
		"s2.ui.TreeView": function () {
			var self = this;
			var ds;
			self.url = "";

			self.datapool = {};
			var tbody = 0;
			self.allexpend = false; //展开所有节点属性，默认为不展开
			self.selected = null;
			self.isCheckBox = false;
			self.muli = false;
			self.mapcol = { id: "id", parentid: "parentid", label: "name", rootid: "0" };
			self.changeMapCol = function (_id, _parentid, _label, rootid) {
				self.mapcol = { id: _id, parentid: _parentid, label: _label, rootid: rootid };
			};
			self.selforder = true;
			self._defdata = "";
			self.treegrid = null;//treegrid 插件,默认不支持
			/**
			 * 展开和加载节点
			 */
			self.expend = function (node) {
				var t = node;
				var span = "";
				var currid = t.attr("id").substr(2);

				if (!t.is("[load='true']")) {
					var pl = t.find("span").length + 1;
					for (var a = 0; a < pl; a++) {

						if (a == pl - 1) {
							if (self.isCheckBox) {
								span += '<span style="float:left;" class="icon checkbox"/>';
							}
							span += '<span style="float:left;" class="icon forder"></span>';
						} else if (a == pl - 2) {

							span += '<span style="float:left;" class="icon t-point"></span>';
						} else {
							span += '<span style="float:left;" class="icon space"></span>';
						}
					}
					
					//span+='<span style="float:left;" class="icon"></span>';
					var n = self.datapool[currid];
					if (n == undefined || currid == '0') {
						t.find(".forder").attr("class", "icon leaf");
						t.find(".t-point").attr("class", "icon space");
						return;
					} else {
						if (self.selforder == false) {
							t.find(".checkbox").hide();
						}
					}
					if (currid == '0') {
						return;
					}
					for (var i in n) {

						var subnode = $('<tr id="t_' + n[i][self.mapcol.id] + '" class="fouder" parentid="' + t.attr("parentid") + "," + n[i][self.mapcol.parentid] + '"><td class="cl"><div class="t-close">' + span + '<a href="javascript:void(0)" class="node">' + n[i][self.mapcol.label] + '</a></div></td></tr>');
						if (n[i].isleaf == 1) {
							subnode.find(".forder").attr("class", "icon leaf");
							subnode.find(".t-point").attr("class", "icon space");
						}
						subnode.data("row", n[i]);
						subnode.insertAfter(t);

						if (self.allexpend) {
							subnode.find(".t-close").attr("class", "t-open");
							subnode.attr("expend", "true").css("display", "block");
							self.expend(subnode);
						}
					}
					t.attr("load", "true");
				}


			};
			
			//全选
			self.checkedAll = function () {
				var t = tbody.find("span.checkbox");
				var p = self.getPnode(t);
				p.attr("row-checked", "true");
				p.attr("class", "active");
				t.attr("class", "icon checkbox checked");
			}
			/**
			 * 选择全部取消
			 */
			self.uncheckedAll = function () {
				var t = tbody.find("span.checkbox");
				var p = self.getPnode(t);
				p.attr("row-checked", "false");
				p.removeAttr("class");
				t.attr("class", "icon checkbox");
			}
			
			/**
			 * 选择指定的项目
			 */
			self.selectItem = function (ids) {
				for (var i = 0; i < ids.length; i++) {
					var tr = tbody.find("tr[id='t_" + ids[i] + "']");
					if (tr.find("span.leaf").length > 0) {
						tr.find("span.checkbox").click();
					}
				}
			} 
			
			
			/**
			 * 选择指定的项目
			 */
			self.unselectItem = function (ids) {
				var tr = null;
				for (var i = 0; i < ids.length; i++) {
					tr = tbody.find("tr[id='t_" + ids[i] + "']");
					tr.attr("row-checked", "false");
					tr.find("span.checkbox").attr("class", "icon checkbox");
				}
			} 
			
			
			/**
			 * 获取没有选择的行
			 */
			self.getUnCheckedRow = function () {
				var unchecked = [];
				tbody.find("tr[row-checked='false']").each(function () {
					unchecked.push($(this).data("row"));
				});
				return unchecked;
			}
			
			/**
			 * 选中指定的索引
			 * @param {Object} i
			 * @return {TypeName} 
			 */
			self.selectIndex = function (i) {
				var tr = self.find("tr:eq(" + i + ")");
				tr.attr("class", "active");
				self.selected = tr;
				return tr.data("row");
			}

			self.getRowCount = function () {
				return tbody.find("tr").length;
			}

			self.itemClick = function (e) {
				//alert("ddd");
				var t = $(this).parent().parent().parent();
				if (e.stopPropagation) {
					e.stopPropagation();
				}

				self.expend(t);
				var currid = t.attr("id").substr(2);
				if (!t.is("[expend]")) {
					self.find("[parentid='" + t.attr("parentid") + "," + currid + "']").show();
					t.find(".t-close").attr("class", "t-open");
					t.attr("expend", "true");
				} else {
					t.removeAttr("expend");
					self.find("[parentid*='" + t.attr("parentid") + "," + currid + "']").hide().removeAttr("expend").find(".t-open").attr("class", "t-close");
					t.find(".t-open").attr("class", "t-close");
				};
			};
			self._width = 0;
			self.parse = function (p) {
				//alert(self.datapool[p].length);
				var n = self.datapool[p];
				var span = "";
				if (self.isCheckBox) {
					span += '<span style="float:left;" class="icon checkbox"/>';
				}
				for (var i in n) {
					if (!n[i][self.mapcol.id]) {
						n[i][self.mapcol.id] = '0';
					}

					var subnode = $('<tr id="t_' + n[i][self.mapcol.id] + '" parentid="0" style="display:block"><td class="cl" ><div class="t-close"><span style="float:left;" class="icon t-point"></span>' + span + '<span style="float:left;" class="icon forder"></span><a href="javascript:void(0)" class="node">' + n[i][self.mapcol.label] + '</a></div></td></tr>');
					if (n[i].isleaf == 1) {
						subnode.find(".forder").attr("class", "icon leaf");
						subnode.find(".t-point").attr("class", "icon space");
					}
					subnode.data("row", n[i]);
					tbody.append(subnode);

					if (self.allexpend) {
						subnode.attr("expend", "true").show("fast");
						subnode.find(".t-close").attr("class", "t-open");
						self.expend(subnode);

					}
				}


			};

			self.draw = function () {
				self.attr("class", "s2treeview");
				if (!self.find("tbody").is("tbody")) {
					self.append('<table style="min-width:100%"><tbody></tbody></table>');
				}

			};
			self.distroy=function(){
				self.remove();			
				delete self;
		    };
			self.setSelect = function () {
				//alert(self._defdata);
				self.uncheckedAll();
				if (self._defdata == "") {
					return;
				}

				if (!self.isload) {
					return;
				}
				if (!self.muli) {
					var t = self.find("tr[id='t_" + self._defdata + "']");
					if (self.selected) {
						self.selected.removeAttr("class");
					}
					self.selected = t;
					t.attr("class", "active");
					if (t.data("row") != undefined) {
						self.selectedRow(t.data("row"));
					}
					return;
				}
				var arr = self._defdata.split(",");
				var str = "";
				for (var s in arr) {
					if (s > 0) {
						str += ",";
					}
					if (self.selforder != "any") {
						str += "tr[id='t_" + arr[s] + "']:has(.leaf) .checkbox";
					} else {
						str += "tr[id='t_" + arr[s] + "'] .checkbox";
					}

				}
				//alert(self.html());
				//checkBoxClick(self.find("#a004"));
				self.find(str).each(function () {
					var t = $(this);
					//alert(str);
					_checkboxCheck(t);
				});
			}

			self.isforder = function (t) {
				return t.find(".forder").is(".forder");
			};
			function selectedRow() {
				var t = $(this);
				if (self.isCheckBox) {
					return;
				}
				//if(t.find)
				if (!self.selforder) {
					if (!self.isforder(t)) {
						if (self.selected) {
							self.selected.removeAttr("class");

						}
						t.attr("class", "active");
						self.selected = t;
						if (self.selectedRow) {
							self.selectedRow(t.data("row"));
						}
					}

				} else {
					if (self.selected) {
						self.selected.removeAttr("class");

					}
					t.attr("class", "active");
					self.selected = t;
					if (self.selectedRow) {
						self.selectedRow(t.data("row"));
					}
				}


			}
			
			/**
			 * 点击checkbox
			 */
			function checkBoxClick() {
				var node = $(this);
				_checkboxCheck(node);

			};

			function _checkboxCheck(node) {
				var t = node;

				var tr = t.parents("tr");
				//如果设置不可以选中文件夹的属性，那么检查到当前选中的是文件夹，文件夹数据不起作用
				if (!self.selforder) {
					if (self.isforder(tr)) {
						return;
					}

				}
				//alert(parentidname);
				if (t.is('.checked')) {
					tr.removeAttr("class");
					tr.attr("row-checked", "false");
					t.attr("class", "icon checkbox");
				} else if (t.is('.halfchecked')) {
					t.attr("class", "icon checkbox checked");
				} else {
					tr.attr("class", "active");
					tr.attr("row-checked", "true");
					t.attr("class", "icon checkbox checked");
				}


				if (self.selforder && (self.selforder != "any")) {
					self.checkChecked(t);
				}

				if (self.checkBoxClick) {
					self.checkBoxClick();
				}
			};

			self.getPnode = function (node) {
				return node.parent().parent().parent();
			};

			self.getSelectedNode = function () {
				return self.selected;
			}

			self.getJoinParentNode = function () {
				var nodes = [];
				var nodesid = [];
				if (self.selected) {
					var parentid = self.selected.attr("parentid").split(",");
					var str = "";
					for (var i = 0; i < parentid.length; i++) {
						if (i > 0) {
							str += ",";
						}
						str += "tr[id='t_" + parentid[i] + "']";
						nodesid.push(str);
					}
					return tbody.find(str);
				} else {
					alert("未选中节点无法显示获取关联节点！");
				}
			}

			self.getCheckedForMod = function (mod) {
				var checked = [];
				if (mod == "all") {
					tbody.find("tr[row-checked='true']").each(function () {
						checked.push($(this).data("row"));
					});
					tbody.find("tr[row-checked='half']").each(function () {
						checked.push($(this).data("row"));
					});
				}
				if (mod == "half") {
					tbody.find("tr[row-checked='true']").each(function () {
						checked.push($(this).data("row"));
					});
				}

				if (mod == "none") {
					tbody.find("tr[row-checked='true']:has(.leaf)").each(function () {
						checked.push($(this).data("row"));
					});
				}

				return checked;
			}

			self.getCheckedRow = function (bl) {
				var checked = [];

				tbody.find("tr[row-checked='true']").each(function () {
					checked.push($(this).data("row"));
				});
				//alert(bl);
				if (bl) {

					tbody.find("tr[row-checked='half']").each(function () {
						checked.push($(this).data("row"));
					});
				}

				return checked;
			};
			self.checkChecked = function (node) {
				if (!node.is(".checkbox")) {
					return;
				}
				//console.log(node)
				var pnode = self.getPnode(node);
				//				if(pnode.attr("parentid")==0){
				//					return;
				//				}
				var parentid = pnode.attr("parentid").split(",");
				var parentidname = parentid[parentid.length - 1];
				var currid = pnode.attr("id").substr(2);

                if (node.is('.checked')) {
					pnode.attr("row-checked", "true");
					pnode.attr("class", "active");

					tbody.find("[parentid*='" + pnode.attr("parentid") + "," + currid + "']").attr("row-checked", "true");
					tbody.find("[parentid*='" + pnode.attr("parentid") + "," + currid + "']").attr("class", "active");
					tbody.find("[parentid*='" + pnode.attr("parentid") + "," + currid + "']").find(".checkbox").attr("class", "icon checkbox checked");
					if (tbody.find("[parentid*='" + pnode.attr("parentid") + "']").find(".checked").length == tbody.find("[parentid*='" + pnode.attr("parentid") + "']").length) {
						tbody.find("[id='t_" + parentidname + "']").find(".checkbox").attr("class", "icon checkbox checked");
						//tbody.find("[id='t_"+parentidname+"']").find(".checkbox").css("background","none");
						tbody.find("[id='t_" + parentidname + "']").attr("row-checked", "true");
						tbody.find("[id='t_" + parentidname + "']").attr("class", "active");
					} else {
						tbody.find("[id='t_" + parentidname + "']").find(".checkbox").attr("class", "icon checkbox halfchecked");
						//tbody.find("[id='t_"+parentidname+"']").find(".checkbox").css("background","#ccc");
						tbody.find("[id='t_" + parentidname + "']").attr("row-checked", "half");
						tbody.find("[id='t_" + parentidname + "']").attr("class", "active");
					}
					//	self.checkChecked(tbody.find("[id='t_"+parentidname+"']").find(".checkbox"));	
				} else if (node.is('.halfchecked')) {
					tbody.find("[id='t_" + parentidname + "']").find(".checkbox").attr("class", "icon checkbox halfchecked");
					tbody.find("[id='t_" + parentidname + "']").attr("row-checked", "half");
					tbody.find("[id='t_" + parentidname + "']").attr("class", "active");
				}
                else {
					pnode.attr("row-checked", "false");
					pnode.removeAttr("class");
					tbody.find("[parentid*='" + pnode.attr("parentid") + "," + currid + "']").attr("row-checked", "false");
					tbody.find("[parentid*='" + pnode.attr("parentid") + "," + currid + "']").removeAttr("class");
					tbody.find("[parentid*='" + pnode.attr("parentid") + "," + currid + "']").find(".checkbox").attr("class", "icon checkbox");
					//alert(tbody.find("[parentid*='"+pnode.attr("parentid")+"']").find("input:checked").length);
					if (tbody.find("[parentid*='" + pnode.attr("parentid") + "']").find(".checked").length < 1) {
						tbody.find("[id='t_" + parentidname + "']").find(".checkbox").attr("class", "icon checkbox");
						//tbody.find("[id='t_"+parentidname+"']").find("input").css("background","none");
						tbody.find("[id='t_" + parentidname + "']").attr("row-checked", "false");
						pnode.removeAttr("class");
					} else {
						tbody.find("[id='t_" + parentidname + "']").find(".checkbox").attr("class", "icon checkbox halfchecked");
						//tbody.find("[id='t_"+parentidname+"']").find("input").css("background","#ccc");
						tbody.find("[id='t_" + parentidname + "']").attr("row-checked", "half");
						tbody.find("[id='t_" + parentidname + "']").attr("class", "active");

					}

				};
				//alert(tbody.find("[id='t_"+parentidname+"']").find(".checkbox"))
				//setTimeout(function(){
					
				self.checkChecked(tbody.find("[id='t_" + parentidname + "']").find(".checkbox"));	
				//},500);
				
			};

			self.initItemSelected = function () {
				self.on("click",'tr',selectedRow);
			};

			self.init = function () {
				if (!self.s2script) {
					self.s2script = self.find("[s2-script]").html();
					self.find("[s2-script]").remove();
					eval(self.s2script);
				}
				self.draw();
				tbody = self.find("tbody");

				ds = $["sender2.ds"]();
				ds.url = self.url;

				ds.success = [function (xml) {
					//alert(xml.text());
					//alert("加载树")
					self.datapool = {};
					xml.find("row").each(function () {
						var t = $(this);
						if (!t.find(self.mapcol.parentid).text() == "") {
							self.datapool[t.find(self.mapcol.parentid).text()] = [];
						} else {
							self.datapool["0"] = [];
						}

					});

					xml.find("row").each(function () {
						var t = $(this);
						var parent1 = "0";
						if (t.find(self.mapcol.parentid).text() != "") {
							parent1 = t.find(self.mapcol.parentid).text();
						}
						var parentid = self.datapool[parent1];
						var rowobj = {};
						t.children().each(function () {
							var c = $(this);
							rowobj[c.context.nodeName] = c.text();
						});
						if (parent1 == 0) {
							parentid.push(rowobj);
						} else {
							parentid.unshift(rowobj);
						}

					});
					var rootid = 0;

					if (self.mapcol.rootid != undefined) {
						rootid = self.mapcol.rootid;
					};

					self.parse(rootid);

					if (self.load_After) {

						self.load_After(xml);
						//alert("loadfafl");
					};
					self.isload = true;
					if (self._defdata != "") {

						self.setSelect();
					}
					
					//console.log(self.datapool);
				}];

				self.on("click",".checkbox", checkBoxClick);
				self.on("click",".t-point,.forder", self.itemClick);

				self.initItemSelected();
				if (self.is("[s2-load]")) {
					self.load();
				}
				if (self.init_After) {
					self.init_After();
				}
			};
			//			self.param=function(p){
			//				
			//				ds.data=p;
			//			};
			
			self.setParam = function (_url, _map) {
				self.url = _url;
				self.mapcol = _map
			}

			self.load = function () {
				ds.url = self.url || self.attr("s2-url");
				tbody.remove();
				self.find("table").append("<tbody></tbody>")
				tbody = self.find("tbody");
				if (self.param) {
					ds.data = self.param;
				}
				if (self.form) {
					//alert(self.form.serialize());
					ds.data = self.form.serialize();
				}
				ds.load();
			};
			self.data("comp", self);
			return self;
		}
	});
})(jQuery);