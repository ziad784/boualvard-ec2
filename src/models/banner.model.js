const dbConn = require('../../config/db.config');


const Banner = function(banner){
    this.active          = banner.active
    this.parent_id       = banner.parent_id
    this.title           = banner.title
    this.description     = banner.description
    this.locale          = banner.locale
    this.refrence_type   = banner.refrence_type,
    this.created_at      = new Date()
    this.updated_at      = new Date()
}
Banner.create = function (newBan, result) {  
    const bannerData ={
        active :newBan.active,
        parent_id: newBan.parent_id,
        created_at:new Date(),
        updated_at: new Date()
    } 
    
    dbConn.query("INSERT INTO banners set ?", bannerData, function (err, banRes) {
        if(err) {
            result(err, null);
        }
        else{
            const transData = [
                {   translation_type: 'title',
                    reference_type: 'banners',
                    locale: newBan.locale,
                    value: newBan.title,
                    reference_id: banRes.insertId,
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {  
                    translation_type: 'description',
                    reference_type: 'banners',
                    locale: newBan.locale,
                    value: newBan.description,
                    reference_id: banRes.insertId,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ]
            for(let i = 0; i < transData.length; i++){
                let post  = transData[i]
                dbConn.query('INSERT INTO translations SET ?', post, function(err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                      }
                      let {  created_at,updated_at,locale, ...all} = newBan
                       result(null, { id: banRes.insertId, ...all });
                });
            }
        }
    })           
}
Banner.findById =  (lang,id, result)=> {
    const query = 'SELECT c.id,(select t.value from translations t where t.reference_id = c.id AND t.reference_type = "banners" and t.translation_type = "title" and t.locale = '+lang+')as "title" , (select t.value from translations t where t.reference_id = c.id AND t.reference_type = "banners" and t.translation_type = "description" and t.locale = '+lang+') as "description",c.parent_id FROM banners c where c.id='+id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 

//Get all product belongs to specific banner

Banner.findAllProductByBanId =  (lang,id, result)=> {
    const query = 'SELECT p.id,(select t.value from translations t where t.reference_id = p.id AND t.reference_type = "products" and t.translation_type = "title" and t.locale = '+lang+')as "title" ,(select t.value from translations t where t.reference_id = p.id AND t.reference_type = "products" and t.translation_type = "description" and t.locale = '+lang+')as "description",(select t.value from translations t where t.reference_id = p.id AND t.reference_type = "products" and t.translation_type = "nutrition" and t.locale = '+lang+')as "nutrition",(select t.value from translations t where t.reference_id = c.id AND t.reference_type = "banners" and t.translation_type = "title" and t.locale = '+lang+')as "banner" ,p.images,p.uom,p.size,p.price,p.featured_image,p.discounted_price FROM products p left join banners c on c.id = p.banner_id where c.id='+ id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 
Banner.findAll =  (lang,result)=> {
    const query = 'SELECT c.id,(select t.value from translations t where t.reference_id = c.id AND t.reference_type = "banners" and t.translation_type = "title" and t.locale = '+lang+')as "title" , (select t.value from translations t where t.reference_id = c.id AND t.reference_type = "banners" and t.translation_type = "description" and t.locale = '+lang+') as "description",c.parent_id FROM banners c'
    console.log(query)
    dbConn.query(query,  (err, res)=> {
        if(err) {
            result(null, err)
        }
        else{
            result(null, res)
        }
    })   
}

Banner.update = (id, banner, result) => {
   
  dbConn.query("UPDATE banners SET active=?,parent_id=? WHERE id = ?", [banner.active,banner.parent_id, id],  (err, res) =>{
        if(err) {
            return result(null, err)
        }else{  
            const transData = [
                {   translation_type: 'title',
                    reference_type: 'banners',
                    locale: banner.locale,
                    value: banner.title,
                    reference_id: id,
                },
                {  
                    translation_type: 'description',
                    reference_type: 'banners',
                    locale: banner.locale,
                    value: banner.description,
                    reference_id: id,
                    
                }
            ]
           for(let i = 0; i < transData.length; i++){
                let update  = transData[i]
                let updateQuery  = "update translations SET value='"+update.value+"' WHERE reference_id = "+id+ " AND  reference_type = 'banners' AND locale = '"+update.locale+"' AND translation_type='"+update.translation_type+"' " 
 
                dbConn.query(updateQuery, function(err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(null, err);
                        return;
                      }
                      if (res.affectedRows == 0) {
                        // not found Tutorial with the id
                        result({ message: "Not update" }, null);
                        return;
                      }
                      let {title, description,parent_id} = banner //destructure of obj object
                      result(null, { id: id, title, description,parent_id });
                    
                });
            }
        }
    }); 
};
Banner.deleteByID = (id, result)=>{
    const query = "DELETE FROM banners WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            const trans = `DELETE FROM translations WHERE reference_id =${id} AND reference_type= "banners"`
            dbConn.query(trans,  (err, res)=> {
                if(err) {
                   return  result(null, err);
                }
                else{
                    result(null, res);
                }
            })
        }
    })
} 

module.exports= Banner;