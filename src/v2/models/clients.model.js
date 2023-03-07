const dbConn = require('../../../config/db.config');


const Clients = function(Clients){
    this.client_img          = Clients.featured_image ? Clients.featured_image : Clients.client_img
    this.client_name         = Clients.client_name
    this.is_featured = Clients.is_featured


}
Clients.create = function (newCat, result) {  
    const ClientsData ={
        client_img :newCat.client_img,
        client_name: newCat.client_name,
        is_featured: newCat.is_featured

      
    } 
    
    dbConn.query("INSERT INTO clients set ?", ClientsData, function (err, catRes) {
        if(err) {
            result(err, null);
        }
        else{
            let {  created_at,updated_at, ...all} = newCat
            result(null, { id: catRes.insertId, ...all });
        }
    })           
}
Clients.findById =  (lang,id, result)=> {
    const query = 'SELECT * FROM clients c where c.id='+id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 

//Get all product belongs to specific Clients

Clients.findClientsByName =  (lang,id, result)=> {
    const query = 'SELECT * FROM clients WHERE `service_for`=? '
    dbConn.query(query,[id],  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 
Clients.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT * FROM clients'

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

Clients.update = (id, Clients, result) => {


    
    const ClientsData ={
        client_img :Clients.client_img,
        client_name: Clients.client_name,
        is_featured: Clients.is_featured

      
    } 
    // let imageJson = JSON.stringify(recipe.images)
    dbConn.query("UPDATE clients SET ? WHERE id = ?", [ClientsData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
                  
            result(null,  {id:id} )
          }
      })
};
Clients.deleteByID = (id, result)=>{
    const query = "DELETE FROM clients WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res);
        }
    })
} 

module.exports= Clients;