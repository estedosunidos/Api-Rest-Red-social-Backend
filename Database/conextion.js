const mongoose= require('mongoose')

const connection = async ()=>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/mi_red_social')
        console.log('connection established')
    }catch(err){
        console.log(err);
        throw new Error('Could not connect to')

    }
}
module.exports = {connection}