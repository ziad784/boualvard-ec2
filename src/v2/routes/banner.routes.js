const { authJwt } = require("../middleware");
const bannerController = require('../controllers/banner.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header({
        "Access-Control-Allow-Headers":"x-access-token, Origin, Content-Type, Accept"
      }
        
      );
      next();
    });
  
  
    app.get(
      "/api/v2/banners",
      bannerController.findAll
    );
    app.get(
      "/api/v2/banners/:id",
      bannerController.findById
    );
    app.get(
      "/api/v2/bannersByCate/:id",
      bannerController.findByCate
    );
    app.post( "/api/v2/banners",
    [authJwt.verifyToken,authJwt.isAdmin],
    bannerController.create
    )
    app.put( "/api/v2/banners/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    bannerController.update)

    app.delete( "/api/v2/banners/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    bannerController.deleteByID
    )
    
   
  }


// Delete a banner
//router.delete('/banners/:id', bannerController.delete)

