var express = require('express');
var server = express();
server.set('views', './views');
server.set('view engine', 'jade');
server.use(express.static('./framework'));

server.listen(3000);  

