(function(doc){
var conf=doc.corejspath;
doc.appconfig = {
    "s2.core.include" : {loaded:true},
    "s2.core.CustomComp": {loaded:true},
    "s2.ui.Panel" : {url:conf+"/ui/s2.ui.Panel.js",css:conf+"/css/default/s2.ui.panel.css",loaded:false},
    "nodejs.Window" : {url:conf+"/ui/nodejs.Window.js",css:conf+"/css/default/nodejs.window.css",loaded:false},
    "s2.ui.TabPage" : {url:conf+"/ui/s2.ui.TabPage.js",css:conf+"/css/default/s2.ui.tabpage.css",loaded:false},
    "s2.ui.DataGrid" : {url:conf+"/ui/s2.ui.DataGrid.js",css:conf+"/css/default/s2.ui.datagrid.css",loaded:false},
    "s2.ui.ListView" : {url:conf+"/ui/s2.ui.ListView.js",css:conf+"/css/default/s2.ui.listview.css",loaded:false},
    "s2.ui.BreadCrumb" : {url:conf+"/ui/s2.ui.BreadCrumb.js",css:conf+"/css/default/s2.ui.breadcrumb.css",loaded:false},
    "s2.ui.Form" : {url:conf+"/ui/s2.ui.Form.js",css:conf+"/css/default/s2.ui.form.css",loaded:false},
    "threejs.Panel" : {url:conf+"/ui/threejs.Panel.js", loaded:false},
    "s2.ui.Anchor" : {url:conf+"/ui/s2.ui.Anchor.js", loaded:false}, 
    "s2.ui.Toolbar" : {url:conf+"/ui/s2.ui.Toolbar.js", loaded:false}, 
    "s2.ui.PerPageBar" : {url:conf+"/ui/s2.ui.PerPageBar.js", css:conf+"/css/default/s2.ui.perpagebar.css",loaded:false},   
    "s2.ui.Split":{url:conf+"/ui/s2.ui.Split.js",loaded:false},
    "s2.ui.Vbox" : {url:conf+"/ui/s2.ui.Vbox.js", loaded:false},
    "s2.ui.Content" : {url:conf+"/ui/s2.ui.Content.js", loaded:false},  
    "s2.ui.GridView" : {url:conf+"/ui/s2.ui.GridView.js", loaded:false},
    "s2.ui.Box" : {url:conf+"/ui/s2.ui.Box.js", loaded:false},
    "s2.ui.Tab" : {url:conf+"/ui/s2.ui.Tab.js", loaded:false},
    "s2.ui.TreeView" : {url:conf+"/ui/s2.ui.TreeView.js",css:conf+"/css/default/s2.ui.treeview.css", loaded:false},
    "s2.ui.Pager" : {url:conf+"/ui/s2.ui.Pager.js", loaded:false},
    "s2.ui.SimpleDataGrid" : {url:conf+"/ui/s2.ui.SimpleDataGrid.js", loaded:false},
    "s2.ui.TreeGrid" : {url:conf+"/ui/s2.ui.TreeGrid.js", extend:["s2.ui.DataGrid","s2.ui.TreeView"], loaded:false},
    "s2.ui.SidebarMenu" : {url:conf+"/ui/s2.ui.SidebarMenu.js", loaded:false},
    "s2.ui.MainContentPanel" : {url:conf+"/ui/s2.ui.MainContentPanel.js", loaded:false}
};

doc.s2type={
    "s2.type.TextField" : {url:conf+"/s2type/s2.type.TextField.js",loaded:false},
    "s2.type.DateTimePicker" : {url:conf+"/s2type/s2.type.DateTimePicker.js",loaded:false}
};

doc.plugin={
    "bootstrap.timepicker.zh" : {url:conf+"/plugins/timepicker/bootstrap-datetimepicker.zh-CN.js",loaded:false},
    "bootstrap.timepicker":{url:conf+"/plugins/timepicker/bootstrap-datetimepicker.min.js",css:conf+"/plugins/timepicker/bootstrap-datetimepicker.min.css",loaded:false}
};
       
})(document);





