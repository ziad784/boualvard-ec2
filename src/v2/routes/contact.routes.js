const { authJwt } = require("../middleware");
const contactController = require('../controllers/contact.controller');
const nodeMail = require("nodemailer")
module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header({
        "Access-Control-Allow-Headers":"x-access-token, Origin, services-Type, Accept"
      }
        
      );
      next();
    });
  
  
    app.get(
      "/api/v2/contact",
      contactController.findAll
    );
    app.get(
      "/api/v2/contact/:id",
      contactController.findById
    );
    app.get(
      "/api/v2/contactById/:id",
      contactController.findAllProductByCatId
    );



    app.post("/api/v2/inquiry",async (req,res)=>{
      
        let transporter = await nodeMail.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false, 
          auth: {
            user: "info-boualvard@alrubaiyat.com", 
            pass: "sy$t3mb00t", 
          },
        });
          


        const FName = req.body.FName ? req.body.FName : "First";
        const LName = req.body.LName ? req.body.LName : "Last";
        const CompanyName = req.body.CompanyName ? req.body.CompanyName : "company";
        const userEmail = req.body.userEmail ? req.body.userEmail : "example@gmail.com"
        const phone = req.body.phone ? req.body.phone : "01234566784"
        const message = req.body.message ? req.body.message : "some message"


        if(FName.length > 0 && LName.length > 0 && CompanyName.length > 0 && userEmail.length > 0 && phone.length > 0 && message.length > 0){



        const mailOption = {
          from: "info@boualvard.com",
          to: "info@boualvard.com",
          subject: "Inquiry",
          html:   "<b style='color:black'>First Name:</b> " + FName +
                  "<br>" +
                  "<b style='color:black'>Last Name:</b> " + LName +
                  "<br>" +
                  "<b style='color:black'>Company Name:</b> " + CompanyName +
                  "<br>" +
                  "<b style='color:black'>Phone Number:</b> " + phone +
                  "<br>" +
                  "<b style='color:black'>User's email:</b> " + userEmail + 
                  "<br>" + 
                  
                  "<b style='color:black'>Message:</b> " + message
        };

        try {
          await transporter.sendMail(mailOption);
          return res.json({message:"sent"});
        } catch (error) {
          return  res.status(500).json({message:"something went wrong"});
        }

      }else{
        res.status(400).json({message:"missing paylaod",payload:req.body})
      }
      
    })

    

    app.post( "/api/v2/contact",
    [authJwt.verifyToken,authJwt.isAdmin],
    contactController.create
    )
    app.put( "/api/v2/contact/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    contactController.update)

    app.delete( "/api/v2/contact/:id",
    [authJwt.verifyToken,authJwt.isAdmin],
    contactController.deleteByID
    )
    
   
  }


// Delete a category
//router.delete('/contact/:id', contactController.delete)

