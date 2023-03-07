const dbConn = require('../../../config/db.config');


const Influencer = function (influencer) {
    this.name_en = influencer.name_en,
    this.name_ar = influencer.name_ar,
    this.featured_image = influencer.featured_image,
    this.video_url = influencer.video_url,
    this.active = influencer.active,
    this.created_at= new Date(),
    this.updated_at= new Date()
}
Influencer.create = function (influencer, result) {
    let imageJson = JSON.stringify(influencer.images)
    const influencerData = {
        name_en: influencer.name_en,
        name_ar: influencer.name_ar,
        featured_image: influencer.featured_image,
        video_url: influencer.video_url,
        active: influencer.active,
        created_at:new Date(),
        updated_at: new Date()
    }  

dbConn.query("INSERT INTO influencers set ?", influencerData, function (err, res) {
        if (err) {
            result(err, null);
        }
        else {
            let { created_at,updated_at, ...all} = influencer
            result(null, {  id: res.insertId, ...all });
        }
    })
}
//set locale from header
Influencer.findById = function (id, result) {
    dbConn.query("SELECT id, name_en, name_ar, featured_image, video_url, active, created_at, updated_at FROM influencers WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err)
            result(err, null)
        }
        else {
            let influencer = res[0]
            result(null, influencer)
        }
    })
}

Influencer.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT id, name_en, name_ar, featured_image, video_url, active, created_at, updated_at FROM influencers'
    
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

Influencer.update = (id, influencer, result) => {

    const influencerData = {
        name_en: influencer.name_en,
        name_ar: influencer.name_ar,
        featured_image: influencer.featured_image,
        video_url: influencer.video_url,
        active: influencer.active,
        created_at:new Date(),
        updated_at: new Date()
    }  

    dbConn.query("UPDATE influencers SET ? WHERE id = ?", [influencerData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
            let {created_at,updated_at,locale, ...all} = influencer //destructure of obj object             
            result(null,  {id:id,...all} )
          }
      })
  }

  Influencer.deleteByID = (id, result)=>{
    const query = "DELETE FROM influencers WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res)
        }
    })
} 


module.exports = Influencer