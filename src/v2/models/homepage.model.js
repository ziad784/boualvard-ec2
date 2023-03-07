const dbConn = require('../../../config/db.config');


const home = function(home){

    this.yt_link = home.yt_link,
    this.service_active = home.service_active
    this.clients_active = home.clients_active
    this.media_active = home.media_active

}

home.create = function (home, result) {  
    const homeData ={
        yt_link: home.yt_link,
        service_active: home.service_active,
        clients_active: home.clients_active,
        media_active: home.media_active,
       
    } 
    
    dbConn.query("INSERT INTO homepage set ?", homeData, function (err, res) {
        if(err) {
            result(err, null);
        }
        else{
            let {  created_at,updated_at, ...all} = home
            result(null, { id: res.insertId, ...all });
        }
    })           
}

home.findById =  (lang,id, result)=> {
    const query = 'SELECT * FROM homepage where id='+id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 

home.findByCate =  (lang,id, result)=> {
    const query = 'SELECT * FROM homepage where img_for = ?'
    dbConn.query(query, [id], (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            console.log(res);
            result(null, res);
        }
    })   
} 

home.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT * FROM homepage'

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

    // console.log(query)
    dbConn.query(query, params, (err, res)=> {
        if(err) {
            result(null, err)
        }
        else{
            result(null, res)
        }
    })   
}

home.update = (id, home, result) => {
    const homeData ={
        yt_link: home.yt_link,
        service_active: home.service_active,
        clients_active: home.clients_active,
        media_active: home.media_active,
       
    } 
    
    // let imageJson = JSON.stringify(product.images)
    dbConn.query("UPDATE homepage SET ? WHERE id = ?", [homeData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
            let {created_at,updated_at,locale, ...all} = home //destructure of obj object             
            result(null,  {id:id,...all} )
          }
      })
}

home.deleteByID = (id, result)=>{
    const query = "DELETE FROM homepage WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res);
        }
    })
} 

module.exports= home;