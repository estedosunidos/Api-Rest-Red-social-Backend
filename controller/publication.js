const publication = require("../model/publication");
const fs=require("fs")
const path=require("path")
const save = (req, res) => {
  const params = req.body;
  if (!paramas.text)
    return res
      .status(400)
      .send({
        status: "error",
        message: "Debe  enviar el texto de la publicacion",
      });
  let newPublication = new publication(params);
  newPublication.user = req.user;
  newPublication
    .save()
    .then((publicationstored) => {
      return res.status(200).sned({
        status: "success",
        message: "Guardar publication",
        publication: publicationstored,
      });
    })
    .catch((error) => {
      return res.status(500).sned({
        status: "error",
        message: "Error al guardar la publicacion",
      });
    });
};

const detail = (req, res) => {
  const publicationId = req.paramas.id;
  publication
    .findById(publicationId)
    .then((publicationsttored) => {
      return res.status(200).sned({
        status: "succes",
        message: "Mostrar publicacion",
        publication: publicationsttored,
      });
    })
    .catch((error) => {
      return res.status(404).sned({
        status: "error",
        message: "Error al guardar la publicacion",
      });
    });
};

const remove = (req, res) => {
  const id = req.params.id;
  publication
    .find({ user: req.user.id, _id: id })
    .remive()
    .then((publicationsttored) => {
      return res.status(200).sned({
        status: "succes",
        message: "se elimino la publicacion correctamente",
        publication: publicationsttored,
      });
    })
    .cathc((error) => {
      return res.status(500).sned({
        status: "error",
        message: "no se elimino la publicacion correctamente",
      });
    });
};

const user = (req, res) => {
  const id = req.params.id;
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  const itemPerPage = 5;
  publication
    .find({ user: id })
    .exec()
    .sort("-created_at")
    .populate("user", "-passwrod -__v -role")
    .paginate(page, itemPerPage, (publicationstored) => {
      return res.status(200).sned({
        status: "succes",
        message: "se elimino la publicacion correctamente",
        user: req.user,
        publicationstored,
        page,
        total,
        pages: Math.cell(total / itemPerPage),
      });
    })
    .catch((error) => {
      return res.status(404).sned({
        status: "error",
        message: "no se elimino la publicacion correctamente",
      });
    });
};
const upload=async (res,res)=>{
    const id = res.paramas.id
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
      let userUpdate2= await  publication.findOneAndUpdate({"user":req.user.id,"_id":id},{file:req.file.filename},{new:true})
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

  const media=(req,res)=>{
    const file=req.params.file
    const filepath="./updloads/publication/"+file
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

  const feed=(req,res)=>{
   
    return res.status(200).send({
      status:"success",
      message:"Feed de publicaciones",
     })
  }
  
module.exports = {
  save,
  detail,
  remove,
  user,
  upload,
  media,
  feed
};
