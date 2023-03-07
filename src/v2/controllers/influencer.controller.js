const Influencer = require('../models/influencer.model');

exports.findAll = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale
    
    let filter = req.query.filter ? JSON.parse(req.query.filter) : null
    let sort = req.query.sort ? JSON.parse(req.query.sort) : null
    let pagination = req.query.pagination ? JSON.parse(req.query.sort) : null

    Influencer.findAll(pagination, sort, filter,(err, influencers)=> {
    if (err){res.send(err)}
    else{
        if(influencers.length>0){
            res.status(200).send(influencers)
        } 
        else{
            res.status(404).send({ error:false, message: 'No influencer found'})
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
        Influencer.create(newInfluencer, (err, influencer) =>{
            if (err){ return res.send(err)}
           else{
               return  res.status(201).send(influencer)
           }
        });
    }
}


exports.findById = (req, res) => {
    Influencer.findById(req.params.id, (err, influencer) => {
        if (err) {
            res.status(500).send({
                message: "Error retrieving influencer with id=" + req.params.influencerId
            });
        } else {
            if (!influencer) {
                res.status(404).send({
                    message: "influencer not found with id=" + req.params.influencerId
                });
            } else {
                res.send(influencer);
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
        Influencer.update(req.params.id, newInfluencer, (err, influencer) =>{
            if (err){return res.send(err)
            }else{
            return res.status(200).send(influencer);
            }
        })
    }
  
}

exports.deleteByID = (req, res) =>{
  Influencer.deleteByID( req.params.id, (err, influencer) =>{
    if (err){res.send(err)}
    else{
        if(influencer.affectedRows>0){
        res.status(200).send({ success:true, message: 'influencer  deleted'})
        }else{
            res.json({ error:false, message: 'No records found'})
        }
    }   
  })
} 