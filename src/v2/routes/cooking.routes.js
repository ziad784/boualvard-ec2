const { authJwt } = require("../middleware");
const cookingController = require('../controllers/cooking.controller');

//router.post('/cms',fileUpload.single('thumbnail') ,cmsController.create)

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header({
        "Access-Control-Allow-Headers":"x-access-token, Origin, Content-Type, Accept"
      });
      next();
    });
  
  
    app.get(
      "/api/v2/cookings",
      cookingController.findAll
    );
    app.get(
      "/api/v2/cookings/:id",
      cookingController.findById
    );
    app.post( "/api/v2/cookings",
    [authJwt.verifyToken,authJwt.isAdmin],
    cookingController.create
    )
    app.put( "/api/v2/cookings/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    cookingController.update)

    app.delete( "/api/v2/cookings/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    cookingController.deleteByID
    ) 
    
   
  }