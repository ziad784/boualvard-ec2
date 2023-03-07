const dbConn = require('../../../config/db.config');


const Services = function(Services){
    this.service_img          = Services.featured_image ? Services.featured_image : Services.service_img
    this.serviceName_en         = Services.serviceName_en
    this.serviceName_ar        = Services.serviceName_ar
    this.serviceDesc_en        = Services.serviceDesc_en
    this.serviceDesc_ar          = Services.serviceDesc_ar
    this.service_for          = Services.service_for

}
Services.create = function (newCat, result) {  
    const ServicesData ={
        service_img :newCat.service_img,
        serviceName_en: newCat.serviceName_en,
        serviceName_ar: newCat.serviceName_ar,
        serviceDesc_en: newCat.serviceDesc_en,
        serviceDesc_ar: newCat.serviceDesc_ar,
        service_for: newCat.service_for,
      
    } 
    
    dbConn.query("INSERT INTO services set ?", ServicesData, function (err, catRes) {
        if(err) {
            result(err, null);
        }
        else{
            let {  created_at,updated_at, ...all} = newCat
            result(null, { id: catRes.insertId, ...all });
        }
    })           
}
Services.findById =  (lang,id, result)=> {
    const query = 'SELECT * FROM services c where c.id='+id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 

//Get all product belongs to specific Services

Services.findServicesByName =  (lang,id, result)=> {
    const query = 'SELECT * FROM services WHERE `service_for`=? '
    dbConn.query(query,[id],  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 
Services.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT * FROM services'

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

Services.update = (id, Services, result) => {


    

    const ServicesData ={
        service_img :Services.service_img,
        serviceName_en: Services.serviceName_en,
        serviceName_ar: Services.serviceName_ar,
        serviceDesc_en: Services.serviceDesc_en,
        serviceDesc_ar: Services.serviceDesc_ar,
        service_for: Services.service_for
      
    } 
    
    // let imageJson = JSON.stringify(recipe.images)
    dbConn.query("UPDATE services SET ? WHERE id = ?", [ServicesData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
                  
            result(null,  {id:id} )
          }
      })
};
Services.deleteByID = (id, result)=>{
    const query = "DELETE FROM services WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res);
        }
    })
} 

module.exports= Services;