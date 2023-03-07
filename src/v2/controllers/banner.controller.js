const Banner = require('../models/banner.model');

exports.findAll = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  

    let filter = req.query.filter ? JSON.parse(req.query.filter) : null
    let sort = req.query.sort ? JSON.parse(req.query.sort) : null
    let pagination = req.query.pagination ? JSON.parse(req.query.sort) : null

    Banner.findAll(pagination, sort, filter, (err, banners)=> {
        if (err){res.send(err)}
        else{
            if(banners.length>0){
                res.send(banners)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}
 
exports.create = (req, res) =>{
    const newBan = new Banner(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newBan.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '') 
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Banner.create(newBan, (err, banner) =>{
            if (err){ return res.send(err);}
           else{
           return res.status(201).send(banner);
           }
        });
    }
}

exports.findAllProductByBanId = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    Banner.findAllProductByBanId(lang,req.params.id, (err, banner)=> {
        
        if (err){res.send(err)}
        else{
            if(products.length>0){
                res.send(banner)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}


exports.findById = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    Banner.findById(lang,req.params.id, (err, banner)=> {
        if (err){res.send(err)}
        else{
            if(banner.length>0){
                
                res.status(200).json(banner[0])
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}

exports.findByCate = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    Banner.findByCate(lang,req.params.id, (err, banner)=> {
        if (err){res.send(err)}
        else{
            if(banner.length>0){
                
                res.status(200).json(banner)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}


exports.update = (req, res) =>{
    const newBan = new Banner(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newBan.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '') 
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Banner.update(req.params.id, newBan, (err, banner) =>{
            if (err){
                return res.send(err)
            }else{
                 return res.status(200).send(banner);
            }
        })
    }
  
}


exports.deleteByID = (req, res) =>{
  Banner.deleteByID( req.params.id, (err, banner) =>{
    if (err){return res.send(err);}
    
    res.json({ success:true, message: 'Banner  deleted'});
  })
}