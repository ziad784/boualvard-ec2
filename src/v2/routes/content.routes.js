const { authJwt } = require("../middleware");
const contentController = require('../controllers/content.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header({
        "Access-Control-Allow-Headers":"x-access-token, Origin, Content-Type, Accept"
      }
        
      );
      next();
    });
  
  
    app.get(
      "/api/v2/content",
      contentController.findAll
    );
    app.get(
      "/api/v2/content/:id",
      contentController.findById
    );
    app.get(
      "/api/v2/contentById/:id",
      contentController.findAllProductByCatId
    );
    app.post( "/api/v2/content",
    [authJwt.verifyToken,authJwt.isAdmin],
    contentController.create
    )
    app.put( "/api/v2/content/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    contentController.update)

    app.delete( "/api/v2/content/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    contentController.deleteByID
    )
    
   
  }


// Delete a category
//router.delete('/content/:id', contentController.delete)

