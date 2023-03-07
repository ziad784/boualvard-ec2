const Home = require('../models/homepage.model');

exports.findAll = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  

    let filter = req.query.filter ? JSON.parse(req.query.filter) : null
    let sort = req.query.sort ? JSON.parse(req.query.sort) : null
    let pagination = req.query.pagination ? JSON.parse(req.query.sort) : null

    Home.findAll(pagination, sort, filter, (err, Homes)=> {
        if (err){res.send(err)}
        else{
            if(Homes.length>0){
                res.send(Homes)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}
 
exports.create = (req, res) =>{
    const newBan = new Home(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newBan.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '') 
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Home.create(newBan, (err, Home) =>{
            if (err){ return res.send(err);}
           else{
           return res.status(201).send(Home);
           }
        });
    }
}

exports.findAllProductByBanId = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    Home.findAllProductByBanId(lang,req.params.id, (err, Home)=> {
        
        if (err){res.send(err)}
        else{
            if(products.length>0){
                res.send(Home)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}


exports.findById = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    Home.findById(lang,req.params.id, (err, Home)=> {
        if (err){res.send(err)}
        else{
            if(Home.length>0){
                
                res.status(200).json(Home[0])
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}

exports.findByCate = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale  
    Home.findByCate(lang,req.params.id, (err, Home)=> {
        if (err){res.send(err)}
        else{
            if(Home.length>0){
                
                res.status(200).json(Home)
            } 
            else{
                res.status(404).send({ error:false, message: 'No record found'})
        }}
    })
}


exports.update = (req, res) =>{
    const newBan = new Home(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newBan.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '') 
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Home.update(req.params.id, newBan, (err, Home) =>{
            if (err){
                return res.send(err)
            }else{
                 return res.status(200).send(Home);
            }
        })
    }
  
}


exports.deleteByID = (req, res) =>{
  Home.deleteByID( req.params.id, (err, Home) =>{
    if (err){return res.send(err);}
    
    res.json({ success:true, message: 'Home  deleted'});
  })
}