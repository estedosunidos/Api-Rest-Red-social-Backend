const jwt = require('jwt-simple');
const moment= require('moment');

const secret="CLAVE-SECRETA-DEL-PROYECTO-DE-LA-RED-SOCIAL-12324556"
const createToke=(user)=>{
    const payload={
        id:user._id,
        name:user.name,
        surname:user.surname,
        nick:user.nick,
        email:user.email,
        role:user.role,
        img:user.img,
        iat:moment().unix(),
        exp:moment().add(30,"days").unix()
    }
    return jwt.encode(payload,secret)
}
module.exports = {createToke,secret   }