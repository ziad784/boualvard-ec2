const dbConn = require('../../../config/db.config');


const Recipe = function (recipe) {
    this.name_en = recipe.name_en,
    this.name_ar = recipe.name_ar,
    this.featured_image = recipe.featured_image,
    this.images = recipe.images,
    this.ingredients_en = recipe.ingredients_en,
    this.ingredients_ar = recipe.ingredients_ar,
    this.instruction_en = recipe.instruction_en,
    this.instruction_ar = recipe.instruction_ar,
    this.active = recipe.active,
    this.created_at= new Date(),
    this.updated_at= new Date()
}
Recipe.create = function (recipe, result) {
    let imageJson = JSON.stringify(recipe.images)
    const recipeData = {
        name_en: recipe.name_en,
        name_ar: recipe.name_ar,
        featured_image: recipe.featured_image,
        images:  JSON.stringify(recipe.images),
        ingredients_en: recipe.ingredients_en,
        ingredients_ar: recipe.ingredients_ar,
        instruction_en: recipe.instruction_en,
        instruction_ar: recipe.instruction_ar,
        active: recipe.active,
        created_at:new Date(),
        updated_at: new Date()
    }  

dbConn.query("INSERT INTO recipes set ?", recipeData, function (err, res) {
        if (err) {
            result(err, null);
        }
        else {
            let { created_at,updated_at, ...all} = recipe
            result(null, {  id: res.insertId, ...all });
        }
    })
}
//set locale from header
Recipe.findById = function (id, result) {
    dbConn.query("SELECT id, name_en, name_ar, featured_image, images, ingredients_en, ingredients_ar, instruction_en, instruction_ar, active, created_at, updated_at FROM recipes WHERE id = ?", [id], function (err, res) {
        if (err) {
            console.log("error: ", err)
            result(err, null)
        }
        else {
            let recipe = res[0]
            recipe.images = JSON.parse(recipe.images)
            result(null, recipe)
        }
    })
}

Recipe.findAll = (pagination = {}, sort ={}, filter ={}, result)=> {
    let query = 'SELECT id, name_en, name_ar, featured_image, images, ingredients_en, ingredients_ar, instruction_en, instruction_ar, active, created_at, updated_at FROM recipes'
    
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
    
    dbConn.query(query, params ,(err, res) => {
        if (err) {
            result(null, err)
        }
        else {
            result(null, res.map((row) => {
                row.images = JSON.parse(row.images)
                return row
            }))
        }
    })
}

Recipe.update = (id, recipe, result) => {

    const recipeData = {
        name_en: recipe.name_en,
        name_ar: recipe.name_ar,
        featured_image: recipe.featured_image,
        images:  JSON.stringify(recipe.images),
        ingredients_en: recipe.ingredients_en,
        ingredients_ar: recipe.ingredients_ar,
        instruction_en: recipe.instruction_en,
        instruction_ar: recipe.instruction_ar,
        active: recipe.active,
        updated_at: new Date()
    }  
    // let imageJson = JSON.stringify(recipe.images)
    dbConn.query("UPDATE recipes SET ? WHERE id = ?", [recipeData, id],  (err, res) =>{
          if(err) {
              return result(null, err)
          }
          else{  
            let {created_at,updated_at,locale, ...all} = recipe //destructure of obj object             
            result(null,  {id:id,...all} )
          }
      })
  }

  Recipe.deleteByID = (id, result)=>{
    const query = "DELETE FROM recipes WHERE id ="+id
     dbConn.query(query,  (err, res)=> {
        if(err) {
            return result(null, err);
        }
        else{
            result(null, res)
        }
    })
} 


module.exports = Recipe