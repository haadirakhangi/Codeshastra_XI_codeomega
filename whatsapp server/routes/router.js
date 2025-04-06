const express = require('express');
const router = express.Router();
const whatsappNotification = require('../helper/whatsappNotification');
//imports here
const userRoutes = require("./userRoutes");

//code here
router.use("/user", userRoutes);
router.get("/health-check", (req,res)=>{
  res.json("Server Health: OK");
})

router.post("/request-access",(req,res)=>{
  const { email } = req.body;
  console.log(email);
  //write mongodb query to find user with email
   let userDoc = userCollection.findOne({email: email});
  
   whatsappNotification = new whatsappNotification(userDoc.adminMobile, `Hello! Request Access to a document is sent by ${email} of ${userDoc.department} department and role:${role}. Please check the document and approve it.`);
    whatsappNotification.sendWhatsappNotification();
  // Perform any necessary operations with the phone number
  // For example, you can save it to a database or send a message

  res.json("Request Sent");
})
  


module.exports = router;