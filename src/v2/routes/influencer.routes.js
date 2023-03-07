const { authJwt } = require("../middleware");
const influencerController = require('../controllers/influencer.controller');

//router.post('/cms',fileUpload.single('thumbnail') ,cmsController.create)

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header({
        "Access-Control-Allow-Headers":"x-access-token, Origin, Content-Type, Accept"
      });
      next();
    });
  
  
    app.get(
      "/api/v2/influencers",
      influencerController.findAll
    );
    app.get(
      "/api/v2/influencers/:id",
      influencerController.findById
    );
    app.post( "/api/v2/influencers",
    [authJwt.verifyToken,authJwt.isAdmin],
    influencerController.create
    )
    app.put( "/api/v2/influencers/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    influencerController.update)

    app.delete( "/api/v2/influencers/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    influencerController.deleteByID
    ) 
    
   
  }



