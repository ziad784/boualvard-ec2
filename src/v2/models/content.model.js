const dbConn = require('../../../config/db.config');


const Content = function(Content){
    this.title          = Content.title
    this.title_ar         = Content.title_ar
    this.content_en        = Content.content_en
    this.content_ar   = Content.content_ar
    this.for          = Content.for

}
Content.create = function (newCat, result) {  
    const ContentData ={
        title :newCat.title,
        title_ar: newCat.title_ar,
        content_en: newCat.content_en,
        content_ar: newCat.content_ar,
        for: newCat.for,
      
    } 
    
    dbConn.query("INSERT INTO content set ?", ContentData, function (err, catRes) {
        if(err) {
            result(err, null);
        }
        else{
            let {  created_at,updated_at, ...all} = newCat
            result(null, { id: catRes.insertId, ...all });
        }
    })           
}
Content.findById =  (lang,id, result)=> {
    const query = 'SELECT * FROM content c where c.id='+id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 

//Get all product belongs to specific Content

Content.findContentByName =  (lang,id, result)=> {
    const query = 'SELECT * FROM content WHERE `for`=? '
    dbConn.query(query,[id],  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 
Content.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT * FROM content'

    let params = []

        if (filter) {
            query += " WHERE";
            Object.keys(filter).forEach(function(key, index) {
                if (Array.isArray(filter[key])) {
                    filter[key].forEach(function(val, i) {
                        query += ` ${key} = ?`;
                        params.push(val);
                        if (filter[key].length - 1 !== i) {
                            query += " OR";
                        }
                    });
                } else {
                    query += ` ${key} = ?`;
                    params.push(filter[key]);
                }

                if (Object.keys(filter).length - 1 !== index) {
                    query += " AND";
                }
            });

        }

        if (sort) {
            query += " ORDER BY"
            Object.keys(sort).forEach(function(key, index) {
                query += ` ${key} ${sort[key]}`

                if (Object.keys(sort).length - 1 !== index) {
                    query += ","
                }
            });
        }

        if (pagination) {
            let limit = pagination.perPage;
            let offset = (pagination.page - 1) * pagination.perPage;
            query += " LIMIT " + offset + "," + limit;

            // query += " LIMIT ? OFFSET ?";
            params.push(parseInt(limit), parseInt(offset));
        }

    console.log(query)
    dbConn.query(query, params, (err, res)=> {
        if(err) {
            result(null, err)
        }
        else{
            result(null, res)
        }
    })   
}

Content.update = (id, Content, result) => {

    console.log(Content);
   
  dbConn.query("UPDATE content SET title=?,title_ar=?,content_en=?,content_ar=?,`for`=? WHERE id = ?", [Content.title,Content.title_ar,Content.content_en,Content.content_ar,Content.for, id],  (err, res) =>{
        if(err) {
            return result(null, err)
        }else{  
          
            result(null, { id: id});
        }
    }); 
};
Content.deleteByID = (id, result)=>{
    const query = "DELETE FROM content WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res);
        }
    })
} 

module.exports= Content;