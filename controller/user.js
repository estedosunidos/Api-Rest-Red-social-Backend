const user = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("../helper/jwt");
const fs=require("fs")
const path = require("path");
const mongoosePaginate=require('mongoose-pagination');
const followservice=require("../helper/followUserId");
const { follower } = require("./follow");
const register = async (req, res) => {
  const params = req.body;
  console.log(params);
  if (!params.name || !params.email || !params.password || !params.nick) {
    console.log("validacion incorrecta");
    return res.status(400).json({
      status: "error",
      messaje: "falta dato por envia",
    });
  }
  //let userToSave = new user(params);
  try {
    const users = await user.find({ email: params.email.toLowerCase() }).exec();
    console.log(users);
    if (users && users.length >= 1) {
      return res.status(200).json({
        status: "success",
        message: "El usuario ya existe",
      });
    }
    let pwd = await bcrypt.hash(params.password, 10);
    params.password=pwd
    let userToSave = new user(params);
    userToSave.save().then(usersave=>{
        if(usersave){
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user:usersave,
              });
        }
    }).catch(err=>{
        if(err) return res.status(500).send({
            status:"err",
            message:"error al guardar el usuario"
        })
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Error en la consulta de usuario",
    });
  }
};
const login=async (req,res)=>{
    const params = req.body
    if(!params.email||!params.password){
        return res.status(400).send({
            status:"err",
            message:"Falta dato por enviar"
        })
    }
    try {
        const user1 = await user.findOne({ email: params.email }).exec();
        if (!user1) {
          return res.status(404).json({
            status: "error",
            message: "User not found",
          });
        }
        let pwd=bcrypt.compareSync(params.password,user1.password)
        if(!pwd){
            return res.status(400).json({
                status: "err",
                message:"No te ha identificado correctamente"
            })
        }
        const toke=jwt.createToke(user1)
        // Perform login logic here
        return res.status(200).json({
          status: "success",
          message: "Te ha identificado correctamente",
          user1:{
            id: user1._id,
            name:user1.name,
            nick:user1.nick,
          },
          toke
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: "Error while finding user",
        });
      }
}
const profile=(req,res)=>{
    const id=req.params.id
    user.findById(id).select({password:0,role:0}).exec().then(async (user1)=>{
      const followInfo=await followservice.followThisUser(req.user.id,id)
       return res.status(200).json({
        status: "success",
        user1: user1,
        following:followInfo.following,
        follower:followInfo.follower
       })


    }).catch((err)=>{
        if(err){  
            return res.status(404).json({
                status:"error",
                message:"El usuario no existe"
            })
        }


    })
}
const list = async (req, res) => {
  try {
    let page1 = 1;
    if (req.params.page) {
      page1 = parseInt(req.params.page);
    }
    let itemPerPage = 5;
     const users = await user.find()
      .sort('_id')
      .skip((page1 - 1) * itemPerPage)
      .limit(itemPerPage)
      .exec();
     const total = await user.countDocuments({});
     const followInfo=await followservice.followThisUser(req.user.id,id)
     return res.status(200).json({
      status: "success",
      message: "Ruta de listado de usuarios",
      page1,
      itemPerPage,
      total,
      users,
      pages:Math.ceil(total/itemPerPage
      ),
      following:followInfo.following,
      follower:followInfo.follower
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error while retrieving users",
    });
  }
};
const update =async (req,res)=>{
  const userIdentity = req.user
  const usersToUpdate=req.body
  delete usersToUpdate.iat
  delete usersToUpdate.exp
  delete usersToUpdate.role
  delete usersToUpdate.img

  const users = await user.find({ email: usersToUpdate.email.toLowerCase() }).exec();
    console.log(users);
    let userIsset=false
    users.forEach(user=>{
      if(user && user._id != userIdentity.id) userIsset = true
    
    })
    
    if (userIsset) {
      return res.status(200).json({
        status: "success",
        message: "El usuario ya existe",
      });
    }
    
    if(usersToUpdate.password){
      let pwd = await bcrypt.hash(usersToUpdate.password, 10);
      params.password=pwd
    }
    try{
      let userUpdate=await user.findByidAndUpdate({_id:userIdentity.id},usersToUpdate,{new:true})
      if( !userUpdate){
        return res.status(400).json({status:"err",message:"Error en la consulta"})
      }
      return res.status(200).json({
        status:"success",
        message: "El usuario actualizo su perfils",
        user:usersToUpdate
      })
    }catch(err){
      return res.status(500).json({status:"err",message:"Error al actualizat"})
    }
}
const upload=async (res,res)=>{
  if(!req.file){
    return res.status(404).send({
      status:"error",
      message:"Peticion no incluyen la imagene"
   })
  }
  let imagen = req.file.originalname
  let imageSplit=imagen.split("/.")
  let extension=imageSplit[1]
  if(extension !="pmng" && extension !="jpg" && extension!="jpeg" && extension!="gif"){
    const filepath=req.file.path
    const fileDeleted=fs.unlinkSync(filepath)
    return res.status(400).send({
      status:"error",
     message:"Extension del fichero invalido"
    })
  }
  try{
    let userUpdate2= await  user.findOneAndUpdate({_id:req.user.id},{image:req.file.filename},{new:true})
  return res.status(200).send({
    status:"success",
    message:"La imagen subida",
    user:userUpdate2,
    file:req.file
   })

  }catch(err){
    return res.status(500).send({
      status:"error",
      message:"error en la subida del avatar",
     })
  }
 

}

const avatar=(req,res)=>{
  const file=req.params.file
  const filepath="./updloads/avatar/"+file
  fs.stat(filepath,(err,exist)=>{
    if(!exist){
      return res.status(404).send({
        status:"error",
        message:"No existe la imagen"
      })
    }
    return res.sendFile(path.resolve(filepath))
  })
  return res.status(200).send({
    status:"success",
    message:"La imagen subida",
   })
}
module.exports = {
  register,
  login,
  profile,
  list,
  update,
  upload,
  avatar
};