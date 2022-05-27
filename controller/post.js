const Post = require('../models/postsModel')
const User = require('../models/usersModel')
const handleErrorAsync = require('../service/handleErrorAsync')
const appError = require('../service/appError')

const posts = {
    getAllPost: async(req,res,next) => {
        const timeSort = req.query.timeSort == 'asc' ? 'createdAt':'-createdAt'
        const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)}:{}
        const allPosts = await Post.find(q).populate({
            path: 'user',
            select: 'name photo'
        }).sort(timeSort)
        res.status(200).json({
            status: "suessces",
            post: allPosts
        })
    },
    createPosts: handleErrorAsync(async(req,res,next)=>{
        const data = req.body.content
        if(data === ""){
            return next(appError(400,'欄位未正確填寫',next))
        }
        const newPost = await Post.create(req.body)
        res.status(200).json({
            status: 'success',
            post: newPost
        })
    }),
    deleteAllPost: handleErrorAsync(async(req,res,next)=>{
        const data = await Post.deleteMany({})
        res.status(200).json({
            status: 'success',
            post: data
        })
    }),
    deletePost: handleErrorAsync(async(req,res,next)=>{
        const id = req.params.id;
        const findPostId = await Post.findById(id)
        if(findPostId === null){
            return next(appError(400,'沒有這則貼文',next))
        }
        const data = await Post.findByIdAndDelete(id)
        res.status(200).json({
            status: 'success',
            post: data 
        })
    }),
    patchPost: handleErrorAsync(async(req,res,next)=>{
        const id = req.params.id;
        const user = req.body.user;
        const content = req.body.content;
        if(!user) return appError(400,'缺少user ID',next)
        if(!content) return appError(400,'未填寫內容',next)
        const data = await Post.findByIdAndUpdate(id,{content})
        res.status(200).json({
            status: 'success',
            post: data
        })
    })
        
}


module.exports = posts;
