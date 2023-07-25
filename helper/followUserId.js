const Follow=require("../model/follow")
const followUserId=async(userId)=>{
    try{
        let following = await Follow.find({"user":userId}).select({"followed":1,"_id":0}).exec()
        let followers=await Follow.find({"followed":userId}).select({"user":1,"_id":0}).exec()

        let following_clean=[]
        following.forEach(follow=> {
            following_clean.push(follow.followed)
        });
        let followers_clean=[]
        followers.forEach(follow=> {
            followers_clean.push(follow.user)
        });

        return {
            following:following_clean,
            followers:followers_clean
        }

    }catch(errr){
        return false
    }
}
const followThisUser= async(identityUserId,profileUserId)=>{
    let following = await Follow.findOne({"user":identityUserId,"followed":profileUserId})
    let follower=await Follow.findOne({"followed":profileUserId,"followed":identityUserId})

    return {
        following,
        follower
    }

}


module.exports={
    followUserId,
    followThisUser
}