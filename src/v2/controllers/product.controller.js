const Product = require('../models/product.model');

exports.findAll = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  

    let filter = req.query.filter ? JSON.parse(req.query.filter) : null
    let sort = req.query.sort ? JSON.parse(req.query.sort) : null
    let pagination = req.query.pagination ? JSON.parse(req.query.sort) : null

    Product.findAll(pagination, sort, filter,(err, products)=> {
    if (err){res.send(err)}
    else{
        if(products.length>0){
            res.status(200).send(products)
        } 
        else{
            res.status(404).send({ error:false, message: 'No product found'})
        }}
  })
}
 
exports.create = (req, res) =>{
    const newProducts = new Product(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newProducts.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '')
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Product.create(newProducts, (err, product) =>{
            if (err){ return res.send(err)}
           else{
               return  res.status(201).send(product)
           }
        });
    }
}


exports.findById = (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if (err) {
            res.status(500).send({
                message: "Error retrieving product with id=" + req.params.productId
            });
        } else {
            if (!product) {
                res.status(404).send({
                    message: "Product not found with id=" + req.params.productId
                });
            } else {
                res.send(product);
            }
        }
    });
}


exports.update = (req, res) =>{
    const newProducts = new Product(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newProducts.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '')
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Product.update(req.params.id, newProducts, (err, product) =>{
            if (err){return res.send(err)
            }else{
            return res.status(200).send(product);
            }
        })
    }
  
}

exports.deleteByID = (req, res) =>{
  Product.deleteByID( req.params.id, (err, product) =>{
    if (err){res.send(err)}
    else{
        if(product.affectedRows>0){
        res.status(200).send({ success:true, message: 'Product  deleted'})
        }else{
            res.json({ error:false, message: 'No records found'})
        }
    }   
  })
} 