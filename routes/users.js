var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool( dbConfig.mysql );
// 响应一个JSON数据
var responseJSON = function (res, ret) {
     if(typeof ret === 'undefined') { 
          res.json({     code:'-200',     msg: '操作失败'   
        }); 
    } else { 
      res.json(ret); 
}};
// 添加
router.get('/add', function(req, res, next){
 // 从连接池获取连接 
pool.getConnection(function(err, connection) { 
	// 获取前台页面传过来的参数  
 	var param = req.query || req.params;   
	// 建立连接 增加内容 title,con,time,read,type 就是数据库中的列名
	// 没有用（列名1，列名2。。。） values（？，？。。。）的原因是当参数传过去时会自动加''导致报错，所以使用set这种写法
	// 以对象形式传参的话会自动解析成 title=值 的格式不会添加''
	connection.query(userSQL.insert,{title:param.title,con:param.con,time:param.time,read:param.read,type:param.type}, function(err, result) {
        if(result) {      
            result = {   
                    code: 200,   
                    msg:'增加成功'
            };  
        }
	    // 以json形式，把操作结果返回给前台页面     
	    responseJSON(res, result);   
	    // 释放连接  
	    connection.release();  
       });
    });
});

//修改内容或者阅读次数
router.get('/update', function(req, res, next){
	pool.getConnection(function(err, connection) { 
		// 获取前台页面传过来的参数  
	 	var param = req.query || req.params;   
		// 建立连接 根据时间戳修改内容
		connection.query(userSQL.update,[{title:param.title,con:param.con,read:param.read,type:param.type},param.time], function(err, result) {
        if(result) {      
            result = {   
                    code: 200,   
                    msg:'修改成功'
            };  
        }
	    // 以json形式，把操作结果返回给前台页面     
	    responseJSON(res, result);   
	    // 释放连接  
	    connection.release();  
       });
    });
});

//删除
router.get('/delete', function(req, res, next){
	pool.getConnection(function(err, connection) { 
		// 获取前台页面传过来的参数  
	 	var param = req.query || req.params;   
		// 建立连接 根据时间戳删除内容
		connection.query(userSQL.delete,[param.time], function(err, result) {
        if(result) {      
            result = {   
                    code: 200,   
                    msg:'删除成功'
            };  
        }
	    // 以json形式，把操作结果返回给前台页面     
	    responseJSON(res, result);   
	    // 释放连接  
	    connection.release();  
       });
    });
});

//根据关键字模糊查询标题
router.get('/queryByTitle', function(req, res, next){
	pool.getConnection(function(err, connection) { 
		// 获取前台页面传过来的参数  
	 	var param = req.query || req.params;   
		// 建立连接 查询标题关键字
		//因为查询是需要'%查询内容%',如果是'%?%'这样的话查询会报错因为会变成'%'查询内容'%';
		var title = '%'+param.title+'%';
		connection.query(userSQL.queryByTitle,title, function(err, result) {
		    // 以json形式，把操作结果返回给前台页面     
		    responseJSON(res, result);   
		    // 释放连接  
		    connection.release();  
       });
    });
});

//根据查询类型 分页查询
router.get('/queryAll', function(req, res, next){
	pool.getConnection(function(err, connection) { 
		// 获取前台页面传过来的参数  
	 	var param = req.query || req.params;   
		// 建立连接 按行查询
		// 因为起始行和查询行数需要时number类型，所以需要先转成number类型
		connection.query(userSQL.queryAll,[param.type,Number(param.start),Number(param.line)], function(err, result) {
			console.log(err)
		    // 以json形式，把操作结果返回给前台页面     
		    responseJSON(res, result);   
		    // 释放连接  
		    connection.release();  
       });
    });
});
module.exports = router;
