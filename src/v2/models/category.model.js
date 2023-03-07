const dbConn = require('../../../config/db.config');


const Category = function(category){
    this.active          = category.active
    this.name_en         = category.name_en
    this.name_ar         = category.name_ar
    this.featured_image     = category.featured_image
    this.is_featured          = category.is_featured
    this.created_at      = new Date()
    this.updated_at      = new Date()
}
Category.create = function (newCat, result) {  
    const categoryData ={
        active :newCat.active,
        name_en: newCat.name_en,
        name_ar: newCat.name_ar,
        featured_image: newCat.featured_image,
        is_featured: newCat.is_featured,
        created_at:new Date(),
        updated_at: new Date()
    } 
    
    dbConn.query("INSERT INTO categories set ?", categoryData, function (err, catRes) {
        if(err) {
            result(err, null);
        }
        else{
            let {  created_at,updated_at, ...all} = newCat
            result(null, { id: catRes.insertId, ...all });
        }
    })           
}
Category.findById =  (lang,id, result)=> {
    const query = 'SELECT id, name_en, name_ar, featured_image, is_featured, active FROM categories c where c.id='+id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 

//Get all product belongs to specific category

Category.findAllProductByCatId =  (lang,id, result)=> {
    const query = 'SELECT p.id,(select t.value from translations t where t.reference_id = p.id AND t.reference_type = "products" and t.translation_type = "title" and t.locale = '+lang+')as "title" ,(select t.value from translations t where t.reference_id = p.id AND t.reference_type = "products" and t.translation_type = "description" and t.locale = '+lang+')as "description",(select t.value from translations t where t.reference_id = p.id AND t.reference_type = "products" and t.translation_type = "nutrition" and t.locale = '+lang+')as "nutrition",(select t.value from translations t where t.reference_id = c.id AND t.reference_type = "categories" and t.translation_type = "title" and t.locale = '+lang+')as "category" ,p.images,p.uom,p.size,p.price,p.featured_image,p.discounted_price FROM products p left join categories c on c.id = p.category_id where c.id='+ id
    dbConn.query(query,  (err, res)=> {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);
        }
    })   
} 
Category.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT id, name_en, name_ar, featured_image, is_featured, active FROM categories'

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

Category.update = (id, category, result) => {
   
  dbConn.query("UPDATE categories SET active=?,name_en=?,name_ar=?,featured_image=?,is_featured=?, updated_at = NOW() WHERE id = ?", [category.active,category.name_en,category.name_ar,category.featured_image,category.is_featured, id],  (err, res) =>{
        if(err) {
            return result(null, err)
        }else{  
            let {name_en, name_ar,featured_image,is_featured, active} = category //destructure of obj object
            result(null, { id: id, name_en, name_ar,featured_image, is_featured, active });
        }
    }); 
};
Category.deleteByID = (id, result)=>{
    const query = "DELETE FROM categories WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res);
        }
    })
} 

module.exports= Category;