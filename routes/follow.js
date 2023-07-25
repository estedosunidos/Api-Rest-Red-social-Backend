const express= require('express')
const router=express.Router();
const followControlle= require('../controller/follow')
const auth=require('../middleware/auth')

router.post("/save",auth.auth,followControlle.save)
router.delete("/unfollow/:id",auth.auth,followControlle.unfollow)
router.get("/following/:id?/:page?",auth.auth,followControlle.following)
router.get("/follower/:id?/:page?",auth.auth,followControlle.follower)

module.exports=router