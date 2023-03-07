const dbConn = require('../../../config/db.config');


const contact = function(contact){
   
    this.phone         = contact.phone
    this.email         = contact.email
    this.address         = contact.address
    this.address_ar         = contact.address_ar
    this.shift         = contact.shift
    this.shift_ar         = contact.shift_ar
    this.map_img          = contact.featured_image ? contact.featured_image : contact.map_img


}
contact.create = function (newCat, result) {  
    const contactData ={
        phone :newCat.phone,
        email: newCat.email,
        address: newCat.address,
        address_ar: newCat.address_ar,
        shift: newCat.shift,
        shift_ar: newCat.shift_ar,
        map_img: newCat.map_img,

      
    } 
    
    dbConn.query("INSERT INTO contact set ?", contactData, function (err, catRes) {
        if(err) {
            result(err, null);
        }
        else{
           
            result(null, { id: catRes.insertId });
        }
    })           
}
contact.findById =  (lang,id, result)=> {
    const query = 'SELECT * FROM contact c where c.id='+id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 

//Get all product belongs to specific contact

contact.findcontactByName =  (lang,id, result)=> {
    const query = 'SELECT * FROM contact WHERE `service_for`=? '
    dbConn.query(query,[id],  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 
contact.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT * FROM contact'

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

contact.update = (id, contact, result) => {


    const contactData ={
        phone :contact.phone,
        email: contact.email,
        address: contact.address,
        address_ar: contact.address_ar,
        shift: contact.shift,
        shift_ar: contact.shift_ar,
        map_img: contact.map_img,

      
    } 
    // let imageJson = JSON.stringify(recipe.images)
    dbConn.query("UPDATE contact SET ? WHERE id = ?", [contactData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
                  
            result(null,  {id:id} )
          }
      })
};
contact.deleteByID = (id, result)=>{
    const query = "DELETE FROM contact WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res);
        }
    })
} 

module.exports= contact;