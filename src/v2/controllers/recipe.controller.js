const Recipe = require('../models/recipe.model');

exports.findAll = (req, res)=> {
    var locale = (JSON.stringify(req.headers['locale']))
    let lang = (locale === undefined) ? "\"en\"" :locale
    
    let filter = req.query.filter ? JSON.parse(req.query.filter) : null
    let sort = req.query.sort ? JSON.parse(req.query.sort) : null
    let pagination = req.query.pagination ? JSON.parse(req.query.sort) : null

    Recipe.findAll(pagination, sort, filter,(err, recipes)=> {
    if (err){res.send(err)}
    else{
        if(recipes.length>0){
            res.status(200).send(recipes)
        } 
        else{
            res.status(404).send({ error:false, message: 'No recipe found'})
        }}
  })
}
 
exports.create = (req, res) =>{
    const newRecipe = new Recipe(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newRecipe.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '')
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Recipe.create(newRecipe, (err, recipe) =>{
            if (err){ return res.send(err)}
           else{
               return  res.status(201).send(recipe)
           }
        });
    }
}


exports.findById = (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err) {
            res.status(500).send({
                message: "Error retrieving recipe with id=" + req.params.recipeId
            });
        } else {
            if (!recipe) {
                res.status(404).send({
                    message: "recipe not found with id=" + req.params.recipeId
                });
            } else {
                res.send(recipe);
            }
        }
    });
}


exports.update = (req, res) =>{
    const newRecipe = new Recipe(req.body)
    locale = (JSON.stringify(req.headers['locale']))
    newRecipe.locale= (locale === undefined) ? "en" :(JSON.stringify(req.headers['locale'])).replace(/^"|"$/g, '')
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        Recipe.update(req.params.id, newRecipe, (err, recipe) =>{
            if (err){return res.send(err)
            }else{
            return res.status(200).send(recipe);
            }
        })
    }
  
}

exports.deleteByID = (req, res) =>{
  Recipe.deleteByID( req.params.id, (err, recipe) =>{
    if (err){res.send(err)}
    else{
        if(recipe.affectedRows>0){
        res.status(200).send({ success:true, message: 'recipe  deleted'})
        }else{
            res.json({ error:false, message: 'No records found'})
        }
    }   
  })
} 