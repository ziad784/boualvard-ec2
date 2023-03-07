const dbConn = require('../../../config/db.config');


const Product = function (product) {
    this.name_en = product.name_en,
    this.name_ar = product.name_ar,
    this.barcode = product.barcode,
    this.category_id = product.category_id,
    this.featured_image = product.featured_image,
    this.images = product.images,
    this.short_desc_en = product.short_desc_en,
    this.short_desc_ar = product.short_desc_ar,
    this.long_desc_en = product.long_desc_en,
    this.long_desc_ar = product.long_desc_ar,
    this.nutrition = product.nutrition,
    this.price = product.price,
    this.active = product.active,
    this.created_at= new Date(),
    this.updated_at= new Date()
}
Product.create = function (product, result) {
    const productData = {
        name_en: product.name_en,
        name_ar: product.name_ar,
        barcode: product.barcode,
        category_id: product.category_id,
        featured_image: product.featured_image,
        images:  JSON.stringify(product.images),
        short_desc_en: product.short_desc_en,
        short_desc_ar: product.short_desc_ar,
        long_desc_en: product.long_desc_en,
        long_desc_ar: product.long_desc_ar,
        nutrition:  JSON.stringify(product.nutrition),
        price: product.price,
        active: product.active,
        created_at:new Date(),
        updated_at: new Date()
    }  
    
    dbConn.query("INSERT INTO products set ?", productData, function (err, res) {
        if (err) {
            result(err, null);
        }
        else {
            let { created_at,updated_at, ...all} = product
            result(null, {  id: res.insertId, ...all });
        }
    })
}
//set locale from header
Product.findById = function (id, result) {
    dbConn.query("SELECT id, name_en, name_ar, barcode, category_id, featured_image, images, short_desc_en, short_desc_ar, long_desc_en, long_desc_ar, nutrition, price, active, created_at, updated_at FROM products WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err)
            result(err, null)
        }
        else {
            let product = res[0]
            product.images = JSON.parse(product.images)
            product.nutrition = JSON.parse(product.nutrition)
            result(null, product)
        }
    })
}

Product.findAll = (pagination = {}, sort ={}, filter ={},result) => {
    let query = 'SELECT id, name_en, name_ar, barcode, category_id, featured_image, images, short_desc_en, short_desc_ar, long_desc_en, long_desc_ar, nutrition, price, active, created_at, updated_at FROM products'
    
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
                row.images = JSON.parse(row.images)
                row.nutrition = JSON.parse(row.nutrition)
                return row
            }))
        }
    })
}

Product.update = (id, product, result) => {

    const productData = {
        name_en: product.name_en,
        name_ar: product.name_ar,
        category_id: product.category_id,
        barcode: product.barcode,
        featured_image: product.featured_image,
        images: JSON.stringify(product.images),
        short_desc_en: product.short_desc_en,
        short_desc_ar: product.short_desc_ar,
        long_desc_en: product.long_desc_en,
        long_desc_ar: product.long_desc_ar,
        nutrition: JSON.stringify(product.nutrition),
        price: product.price,
        active: product.active,
        updated_at: new Date()
    }
    // let imageJson = JSON.stringify(product.images)
    dbConn.query("UPDATE products SET ? WHERE id = ?", [productData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
            let {created_at,updated_at,locale, ...all} = product //destructure of obj object             
            result(null,  {id:id,...all} )
          }
      })
  }

  Product.deleteByID = (id, result)=>{
    const query = "DELETE FROM products WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res)
        }
    })
} 


module.exports = Product