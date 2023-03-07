const { authJwt } = require("../middleware");
const servicesController = require('../controllers/services.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header({
        "Access-Control-Allow-Headers":"x-access-token, Origin, services-Type, Accept"
      }
        
      );
      next();
    });
  
  
    app.get(
      "/api/v2/services",
      servicesController.findAll
    );
    app.get(
      "/api/v2/services/:id",
      servicesController.findById
    );
    app.get(
      "/api/v2/servicesById/:id",
      servicesController.findAllProductByCatId
    );
    app.post( "/api/v2/services",
    [authJwt.verifyToken,authJwt.isAdmin],
    servicesController.create
    )
    app.put( "/api/v2/services/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    servicesController.update)

    app.delete( "/api/v2/services/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    servicesController.deleteByID
    )
    
   
  }


// Delete a category
//router.delete('/services/:id', servicesController.delete)

