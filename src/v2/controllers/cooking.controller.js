const Influencer = require('../models/cooking.model');

exports.findAll = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale
    
    let filter = req.query.filter ? JSON.parse(req.query.filter) : null
    let sort = req.query.sort ? JSON.parse(req.query.sort) : null
    let pagination = req.query.pagination ? JSON.parse(req.query.sort) : null

    Influencer.findAll(pagination, sort, filter,(err, cookings)=> {
    if (err){res.send(err)}
    else{
        if(cookings.length>0){
            res.status(200).send(cookings)
        } 
        else{
            res.status(404).send({ error:false, message: 'No cooking found'})
        }}
  })
}
 
exports.create = (req, res) =>{
    const newInfluencer = new Influencer(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newInfluencer.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '')
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Influencer.create(newInfluencer, (err, cooking) =>{
            if (err){ return res.send(err)}
           else{
               return  res.status(201).send(cooking)
           }
        });
    }
}


exports.findById = (req, res) => {
    Influencer.findById(req.params.id, (err, cooking) => {
        if (err) {
            res.status(500).send({
                message: "Error retrieving cooking with id=" + req.params.cookingId
            });
        } else {
            if (!cooking) {
                res.status(404).send({
                    message: "cooking not found with id=" + req.params.cookingId
                });
            } else {
                res.send(cooking);
            }
        }
    });
}


exports.update = (req, res) =>{
    const newInfluencer = new Influencer(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newInfluencer.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '')
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Influencer.update(req.params.id, newInfluencer, (err, cooking) =>{
            if (err){return res.send(err)
            }else{
            return res.status(200).send(cooking);
            }
        })
    }
  
}

exports.deleteByID = (req, res) =>{
  Influencer.deleteByID( req.params.id, (err, cooking) =>{
    if (err){res.send(err)}
    else{
        if(cooking.affectedRows>0){
        res.status(200).send({ success:true, message: 'cooking  deleted'})
        }else{
            res.json({ error:false, message: 'No records found'})
        }
    }   
  })
} 