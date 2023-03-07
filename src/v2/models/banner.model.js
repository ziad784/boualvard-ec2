const dbConn = require('../../../config/db.config');


const Banner = function(banner){

    this.img = banner.featured_image ? banner.featured_image : banner.img ,
    this.img_for = banner.img_for

}

Banner.create = function (banner, result) {  
    const bannerData ={
        img: banner.img,
        img_for: banner.img_for,
       
    } 
    
    dbConn.query("INSERT INTO banners set ?", bannerData, function (err, res) {
        if(err) {
            result(err, null);
        }
        else{
          
            result(null, { id: res.insertId});
        }
    })           
}

Banner.findById =  (lang,id, result)=> {
    const query = 'SELECT * FROM banners where id='+id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 

Banner.findByCate =  (lang,id, result)=> {
    const query = 'SELECT * FROM banners where img_for = ?'
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

Banner.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT * FROM banners'

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

Banner.update = (id, banner, result) => {
    const bannerData ={
        img: banner.img,
        img_for: banner.img_for,
       
    } 

    console.log(banner);
    
    // let imageJson = JSON.stringify(product.images)
    dbConn.query("UPDATE banners SET ? WHERE id = ?", [bannerData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
            let {created_at,updated_at,locale, ...all} = banner //destructure of obj object             
            result(null,  {id:id,...all} )
          }
      })
}

Banner.deleteByID = (id, result)=>{
    const query = "DELETE FROM banners WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res);
        }
    })
} 

module.exports= Banner;