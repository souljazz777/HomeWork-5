const express = require('express')
const router = express.Router()
const posts = require('../controller/post')

router.get('/', posts.getAllPost)
router.post('/', posts.createPosts)
router.delete('/apis', posts.deleteAllPost)
router.delete('/api/:id', posts.deletePost)
router.patch('/:id', posts.patchPost)

module.exports = router;