const { authJwt } = require("../middleware");
const clientsController = require('../controllers/clients.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header({
        "Access-Control-Allow-Headers":"x-access-token, Origin, services-Type, Accept"
      }
        
      );
      next();
    });
  
  
    app.get(
      "/api/v2/clients",
      clientsController.findAll
    );
    app.get(
      "/api/v2/clients/:id",
      clientsController.findById
    );
    app.get(
      "/api/v2/clientsById/:id",
      clientsController.findAllProductByCatId
    );
    app.post( "/api/v2/clients",
    [authJwt.verifyToken,authJwt.isAdmin],
    clientsController.create
    )
    app.put( "/api/v2/clients/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    clientsController.update)

    app.delete( "/api/v2/clients/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    clientsController.deleteByID
    )
    
   
  }


// Delete a category
//router.delete('/clients/:id', clientsController.delete)

