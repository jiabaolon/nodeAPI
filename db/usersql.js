var UserSQL = {  
	insert:"insert into studylife set ?",                                          //增
    update:"update studylife set ? where time=?",                                  //改
    delete: "delete from studylife where time=?",                                  //删
    queryByTitle: "select * from studylife where title like ?",                    //根据搜索关键词查询标题
    queryAll: "select * from studylife where type=? limit ?,?"                     //根据查询类型 分页查询
};
module.exports = UserSQL;