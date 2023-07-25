const Follow = require("../model/follow")
const user = require("../model/user")
const mongoosePaginate=require("mongoose-pagination")
const followservice=require("../helper/followUserId")
const save = (req,res) => {
    const params=req.body
    const identity=req.user
    let userToFollow = new Follow()
    userToFollow.user=identity.id
    userToFollow.followed=params.followed

    userToFollow.save((error,followstored)=>{
        if(error||!followstored){
            return res.status(400).send({
                status:"error",
                message: "No se ha pudido seguir al ususario "
            })
        }
        return res.status(200).send({
            status:"success",
            message: "Metodo dar follow",
            identity:req.user,
            follow:followstored
        })
    })
   
}

const unfollow = (req,res) => {
    const userid=req.user.id
    const followeid=req.params.id
    Follow.find({
        "user":userid,
        "followed":followeid
    }).remove((error,followstored)=>{
        if(error||!followstored){
            return res.status(500).send({
                status:"error",
                message: "No se ha pudido seguir al ususario"
            })

        }
        return res.status(200).send({
            status:"succes",
            message: "Follow eliominada correctam,ente",
            identity:req.user,
            followstored
        })
    })
}

const following = (res,req)=>{
    const userid=req.user.id
    if(req.params.id) userid=req.params.id
    let page=1
    if(req.params.page) {
        page=req.params.page
    }
    const  itemsPerPage=5
    Follow.find({followed:userid})
    .populate("user followed","-passwoed -role -__v")
    .paginate(page,itemsPerPage,async (error,follows,total)=>{
        let followuser=await followservice.followUserId(req.params.id)
        return res.status(200).send({
            status:"succes",
            message: "Listado de usuario que me sigue",
            follows,
            total,
            pages:Math.ceil(total/itemsPerPage),
            user_following:followuser.following,
            user_followme:followuser.followers
        })
    })
    return res.status(200).send({
        status:"succes",
        message: "Listado de usuario que estoy siguiendo",
    })
}

const follower = (res,req)=>{
    const userid=req.user.id
    if(req.params.id) userid=req.params.id
    let page=1
    if(req.params.page) {
        page=req.params.page
    }
    const  itemsPerPage=5
    Follow.find({user:userid}).populate("user followed","-passwoed -role -__v").paginate(page,itemsPerPage,async (error,follows,total)=>{
        let followuser=await followservice.followUserId(req.params.id)
        return res.status(200).send({
            status:"succes",
            message: "Listado de usuario que me sigue",
            follows,
            total,
            pages:Math.ceil(total/itemsPerPage),
            user_following:followuser.following,
            user_followme:followuser.followers
        })
    })
}
module.exports={
    save,
    unfollow,
    following,
    follower
}