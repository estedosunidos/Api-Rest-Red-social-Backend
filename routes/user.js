const express= require('express')
const router=express.Router();
const userControlle= require('../controller/user')
const auth=require('../middleware/auth')
const multer=require("multer")
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads/avatar")
    },
    filename:(req,file,cb)=>{
        cb(null,"avatar-"+Date.now()+"-"+file.originalname)
    }
})
const uploads=multer({storage})
router.post("/register",userControlle.register)
router.post("/login",userControlle.login)
router.get('/profile/:id',auth.auth,userControlle.profile)
router.get('/list/:page?',auth.auth,userControlle.list)
router.put('/update',auth.auth,userControlle.update)
router.post('/upload',[auth.auth,uploads.single("file0")],userControlle.upload)
router.get('/avatar/:file',auth.auth,userControlle.avatar)
module.exports=router

