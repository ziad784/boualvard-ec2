const contact = require('../models/contact.model');

exports.findAll = (req, res)=> {

    let filter = req.query.filter ? JSON.parse(req.query.filter) : null
    let sort = req.query.sort ? JSON.parse(req.query.sort) : null
    let pagination = req.query.pagination ? JSON.parse(req.query.sort) : null

    // const limit = req.query.limit;
    // const offset = req.query.offset;
    // var locale = (JSON.stringify(req.headers['locale']))
    // let lang = (locale === undefined) ? "\"en\"" :locale  
    contact.findAll(pagination, sort, filter, (err, categories)=> {
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
    const newCat = new contact(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newCat.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '') 
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        contact.create(newCat, (err, contact) =>{
            if (err){ return res.send(err);}
           else{
           return res.status(201).send(contact);
           }
        });
    }
}

exports.findAllProductByCatId = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    contact.findcontactByName(lang,req.params.id, (err, contact)=> {
        
        if (err){res.send(err)}
        else{
            if(contact.length>0){
                res.send(contact)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}


exports.findById = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    contact.findById(lang,req.params.id, (err, contact)=> {
        if (err){res.send(err)}
        else{
            if(contact.length>0){
                
                res.status(200).json(contact[0])
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}


exports.update = (req, res) =>{
    const newCat = new contact(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newCat.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '') 
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        contact.update(req.params.id, newCat, (err, contact) =>{
            if (err){
                return res.send(err)
            }else{
                 return res.status(200).send(contact);
            }
        })
    }
  
}


exports.deleteByID = (req, res) =>{
  contact.deleteByID( req.params.id, (err, contact) =>{
    if (err){return res.send(err);}
    
    res.json({ success:true, message: 'contact  deleted'});
  })
}