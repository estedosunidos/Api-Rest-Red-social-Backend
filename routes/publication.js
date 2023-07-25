const express= require('express')
const router=express.Router();
const publicationControlle= require('../controller/publication')
const auth=require("../middleware/auth")
const multer=require("multer")
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads/publication")
    },
    filename:(req,file,cb)=>{
        cb(null,"publication-"+Date.now()+"-"+file.originalname)
    }
})
const uploads=multer({storage})

router.post('/save',auth.auth, publicationControlle.save)
router.get("/detail/:id",auth.auth, publicationControlle.detail)
router.delete("/remove/:id",auth.auth, publicationControlle.remove)
router.get("/user/:id/:page?",auth.auth, publicationControlle.user)
router.post("/upload/:id"[auth.auth, uploads.single("file0")],publicationControlle.upload)
router.get("/media/:file",auth.auth, publicationControlle.media)
router.get("/feed/:page?",auth.auth, publicationControlle.media)

module.exports=router