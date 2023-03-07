const dbConn = require('../../../config/db.config');


const Cooking = function (cooking) {
    this.name_en = cooking.name_en,
    this.name_ar = cooking.name_ar,
    this.featured_image = cooking.featured_image,
    this.video_url = cooking.video_url,
    this.active = cooking.active,
    this.created_at= new Date(),
    this.updated_at= new Date()
}
Cooking.create = function (cooking, result) {
    let imageJson = JSON.stringify(cooking.images)
    const cookingData = {
        name_en: cooking.name_en,
        name_ar: cooking.name_ar,
        featured_image: cooking.featured_image,
        video_url: cooking.video_url,
        active: cooking.active,
        created_at:new Date(),
        updated_at: new Date()
    }  

dbConn.query("INSERT INTO cookings set ?", cookingData, function (err, res) {
        if (err) {
            result(err, null);
        }
        else {
            let { created_at,updated_at, ...all} = cooking
            result(null, {  id: res.insertId, ...all });
        }
    })
}
//set locale from header
Cooking.findById = function (id, result) {
    dbConn.query("SELECT id, name_en, name_ar, featured_image, video_url, active, created_at, updated_at FROM cookings WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err)
            result(err, null)
        }
        else {
            let cooking = res[0]
            result(null, cooking)
        }
    })
}

Cooking.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT id, name_en, name_ar, featured_image, video_url, active, created_at, updated_at FROM cookings'
    
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
    
    dbConn.query(query, params, (err, res) => {
        if (err) {
            result(null, err)
        }
        else {
            result(null, res.map((row) => {
                return row
            }))
        }
    })
}

Cooking.update = (id, cooking, result) => {

    const cookingData = {
        name_en: cooking.name_en,
        name_ar: cooking.name_ar,
        featured_image: cooking.featured_image,
        video_url: cooking.video_url,
        active: cooking.active,
        created_at:new Date(),
        updated_at: new Date()
    }  

    dbConn.query("UPDATE cookings SET ? WHERE id = ?", [cookingData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
            let {created_at,updated_at,locale, ...all} = cooking //destructure of obj object             
            result(null,  {id:id,...all} )
          }
      })
  }

  Cooking.deleteByID = (id, result)=>{
    const query = "DELETE FROM cookings WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res)
        }
    })
} 


module.exports = Cooking