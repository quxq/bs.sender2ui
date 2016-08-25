(
      function (doc) {
            doc.corejspath= "http://localhost:3000/sender2js";

            var domain = doc.corejspath;
            var head = document.querySelector("head");
            var res = [];
            var loadnum = 0;
            /**
             * 动态创建脚本
             */
            doc.addscript = function (src, fun) {
                  var script = document.createElement("script");
                  if(src.indexOf("http")==-1){
                      script.setAttribute("src", domain + src);
                  }else{
                      cscriptss.setAttribute("src",src);  
                  }
                  res.push(script);
            }

           /**
            * 动态加入样式表
            */
            doc.addcss = function (src) {
                  var css = document.createElement("link");
                  css.setAttribute("rel", "stylesheet");
                  css.setAttribute("type", "text/css");
                  if(src.indexOf("http")==-1){
                      css.setAttribute("href", domain + src);
                  }else{
                      css.setAttribute("href",src);  
                  }
                 
                  res.push(css);

            }
         
         
            /**
             * 载入资源，加入资源次数和资源池的长度对比，如果小于资源池的长度递归执行资源调用，等于长度表示资源加载完成，回调资源完成方法。
             */
            doc.loadres = function (i) {
                  
                  if (i < res.length) {
                        res[i].onload = res[i].onreadystatechange = function () {
                              i = i + 1;
                              doc.loadres(i);
                        }
                        head.appendChild(res[i]);
                  } else {
                        if (doc.loadedres) {
                              doc.loadedres();
                        }
                  }

            }

            doc.addcss("/plugins/bootstrap/css/bootstrap.min.css"); 
            doc.addcss("http://cdn.bootcss.com/font-awesome/4.5.0/css/font-awesome.min.css");
            doc.addcss("http://cdn.bootcss.com/ionicons/2.0.1/css/ionicons.min.css");
            
            doc.addcss("/plugins/iCheck/all.css"); 
            doc.addcss("/plugins/pace/pace.min.css"); 
            doc.addcss("/css/AdminLTE/styles.css"); 
           
            doc.addcss("/plugins/AdminLTE/css/AdminLTE.min.css"); 
            doc.addcss("/plugins/AdminLTE/css/skins/skin-blue.min.css"); 
            
            doc.addscript("/plugins/jQuery/jquery-2.2.3.min.js"); 
            doc.addscript("/plugins/slimScroll/jquery.slimscroll.min.js");
            
            doc.addscript("/plugins/bootstrap/js/bootstrap.min.js");
            doc.addscript("/plugins/iCheck/icheck.min.js");
            doc.addscript("/plugins/fastclick/fastclick.js");
            
            doc.addscript("/plugins/AdminLTE/js/app.min.js");
       
            doc.addscript("/core/s2.conf.js");       
            doc.addscript("/core/s2.core.js");
            doc.loadres(0);
            
            doc.loadedres=function(){
                  $.compCheck($("[s2-comp='s2.core.CustomComp']")); 
                  $("body").css("display","");           
            }
      }
      )
      (document);