const jwt =require("jwt-simple");
const moment=require("moment");
const libjwt=require("../helper/jwt")
const secret=libjwt.secret

exports.auth=(req,res,next) => {
    if(!req.headers.authorization){
        return res.status(403).send({
            status:"error",
            message:"La peticion no tiene la cabecera de authenticacion"
        })
    }
    let token = req.headers.authorization.replace(/['"]+/g,'')
    try{
        let payload=jwt.decode(token,secret)

        if(payload.exp<=moment().unix()){
            return res.status(401).send({
                status:"error",
                message:"Token ha expirado"
            })
        }
        req.user=payload

    }catch(err){
        return res.status(404).send({
            status:"error",
            message:"Token invalido"
        })
    }
    next()
}