const express = require('express');
const router = express.Router();
const userCollection = require("../db").db().collection("users");
const WhatsappNotification = require('../helper/whatsappNotification');
//imports here
const userRoutes = require("./userRoutes");

//code here
router.use("/user", userRoutes);
router.get("/health-check", (req,res)=>{
  res.json("Server Health: OK");
})

router.post("/request-access",async (req,res)=>{
  const { email } = req.body;
  console.log(email);
  //write mongodb query to find user with email
   let userDoc = await userCollection.findOne({email: email});
  console.log(userDoc);
  let whatsappNotification = new WhatsappNotification(userDoc.admin_mobile, `Hello! Request Access to a document is sent by ${email} of ${userDoc.department} department and role:${userDoc.role}. Please check the document and approve it.\nDo you want to approve?`);
    whatsappNotification.sendWhatsappNotification();
  // Perform any necessary operations with the phone number
  // For example, you can save it to a database or send a message

  res.json("Request Sent");
})
  


module.exports = router;