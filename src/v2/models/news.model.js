const dbConn = require('../../../config/db.config');


const News = function (news) {
    this.title_en=news.title_en,
    this.title_ar=news.title_ar,
    this.description_en=news.description_en,
    this.description_ar=news.description_ar

}
News.create = function (news, result) {
    const newsData = {
        title_en:news.title_en,
        title_ar:news.title_ar,
        description_en:news.description_en,
        description_ar:news.description_ar,
    } 

    dbConn.query("INSERT INTO news set ?", newsData, function (err, newsRes) {
        if (err) {
            result(err, null);
        }
        else {
           
            result(null, { id: newsRes.insertId });
        }
    })
}

News.findById =  (locale,id, result)=> {
    //const query = 'SELECT n.id,(select t.value from translations t where t.reference_id = n.id AND t.reference_type = "news" and t.translation_type = "title" and t.locale = '+locale+')as "title" , (select t.value from translations t where t.reference_id = n.id AND t.reference_type = "news" and t.translation_type = "description" and t.locale = '+locale+')as "description", (select t.value from translations t where t.reference_id = n.id AND t.reference_type = "news" and t.translation_type = "content" and t.locale = '+locale+')as "content", n.featured_image,n.thumbnail,n.views FROM news n where n.id='+id
    const query = "SELECT * FROM news where id = ?"
    
    
    dbConn.query(query,[id],(err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 
News.findAll = (locale,result) => {
    //const query = 'SELECT n.id,(select t.value from translations t where t.reference_id = n.id AND t.reference_type = "news" and t.translation_type = "title" and t.locale = '+locale+')as "title" , (select t.value from translations t where t.reference_id = n.id AND t.reference_type = "news" and t.translation_type = "description" and t.locale = '+locale+')as "description", (select t.value from translations t where t.reference_id = n.id AND t.reference_type = "news" and t.translation_type = "content" and t.locale = '+locale+')as "content", n.featured_image,n.thumbnail,n.views FROM news n'
    const query = "SELECT * FROM news"
    dbConn.query(query, (err, res) => {
        if (err) {
            result(null, err)
        }
        else {
            result(null, res)
        }
    })
}

News.update = (id, news, result) => {
    console.log("NEWS",news);
    dbConn.query("UPDATE news SET title_en=?,title_ar=?,description_en=?,description_ar=? WHERE id = ?", [news.title_en,news.title_ar,news.description_en,news.description_ar, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }else{
            result(null,"updated")
          }
      }); 
  };
News.deleteByID = (id, result)=>{
    const query = "DELETE FROM news WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res);
        }
    })
}  

module.exports = News