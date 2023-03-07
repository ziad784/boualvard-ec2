const { authJwt } = require("../middleware");
const homeController = require('../controllers/homepage.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header({
        "Access-Control-Allow-Headers":"x-access-token, Origin, Content-Type, Accept"
      }
        
      );
      next();
    });
  
  
    app.get(
      "/api/v2/homepage",
      homeController.findAll
    );
    app.get(
      "/api/v2/homepage/:id",
      homeController.findById
    );
    app.get(
      "/api/v2/homepageByCate/:id",
      homeController.findByCate
    );
    app.post( "/api/v2/homepage",
    [authJwt.verifyToken,authJwt.isAdmin],
    homeController.create
    )
    app.put( "/api/v2/homepage/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    homeController.update)

    app.delete( "/api/v2/homepage/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    homeController.deleteByID
    )
    
   
  }


// Delete a home
//router.delete('/homes/:id', homeController.delete)

