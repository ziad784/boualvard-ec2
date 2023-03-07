const Services = require('../models/services.model');

exports.findAll = (req, res)=> {

    let filter = req.query.filter ? JSON.parse(req.query.filter) : null
    let sort = req.query.sort ? JSON.parse(req.query.sort) : null
    let pagination = req.query.pagination ? JSON.parse(req.query.sort) : null

    // const limit = req.query.limit;
    // const offset = req.query.offset;
    // var locale = (JSON.stringify(req.headers['locale']))
    // let lang = (locale === undefined) ? "\"en\"" :locale  
    Services.findAll(pagination, sort, filter, (err, categories)=> {
        if (err){res.send(err)}
        else{
            if(categories.length>0){
                res.send(categories)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}
 
exports.create = (req, res) =>{
    const newCat = new Services(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newCat.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '') 
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Services.create(newCat, (err, Services) =>{
            if (err){ return res.send(err);}
           else{
           return res.status(201).send(Services);
           }
        });
    }
}

exports.findAllProductByCatId = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    Services.findServicesByName(lang,req.params.id, (err, Services)=> {
        
        if (err){res.send(err)}
        else{
            if(Services.length>0){
                res.send(Services)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}


exports.findById = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    Services.findById(lang,req.params.id, (err, Services)=> {
        if (err){res.send(err)}
        else{
            if(Services.length>0){
                
                res.status(200).json(Services[0])
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}


exports.update = (req, res) =>{
    const newCat = new Services(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newCat.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '') 
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Services.update(req.params.id, newCat, (err, Services) =>{
            if (err){
                return res.send(err)
            }else{
                 return res.status(200).send(Services);
            }
        })
    }
  
}


exports.deleteByID = (req, res) =>{
  Services.deleteByID( req.params.id, (err, Services) =>{
    if (err){return res.send(err);}
    
    res.json({ success:true, message: 'Services  deleted'});
  })
}