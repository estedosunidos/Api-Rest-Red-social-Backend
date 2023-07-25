const {Schema,model }= require("mongoose")

const FollowSchema=Schema({
    user:{
        type:Schema.ObjectId,
        ref:"user"
    },
    followed:{
        type:Schema.ObjectId,
        ref:"user"
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})
module.exports = model("Follow",FollowSchema,"Follows")