const { Post, User, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const router = require('express').Router();

//TODO: only authenticated users can create a post
router.post('/', async (req, res) => {
    try {
    const newPost = await Post.create({
        title: req.params.title,
        text: req.body.text,
        //TODO: userId will come from req.session once we have set up our sessions
        userId: req.body.userId
    });
    res.status(201).json(newPost)
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/', async (res) => {
    try {
const posts = await Post.findAll(req.params.postId, {
    include: [{model: User, attributes: ['username'] }],
    attributes: {
        include: [
            [
                sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.postId = post.id)'), 
                'commentsCount',
            ],
        ],
    },
});
res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get('/:postId', async (res) => {
    try {
const posts = await Post.findByPk(req.params.postId, {
    include: [{model: User, attributes: ['username'] }, 
{model: Comment, include: {model: User, attributes: ['username']}}],
    attributes: {
        include: [
            [
                sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.postId = post.id)'), 
                'commentsCount',
            ],
        ],
    },
});
res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

//TODO: a user can update a post only if authenticated and the creator of the post
router.put('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.update(req.body, {
            where: {
                id: req.params.postId,
                // TODO: userId will come from req.session once we have set up our sessions
                userId: req.params.userId
            },
        });
        if(!updatedPost[0]) return res.status(406).json({message: 'this request cannot be completed'});
        res.status(202).json(updatedPost);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

//TODO: only admin or authenticated users can delete their own posts
router.delete('/:postId', async (req, res) => {
    try {
        const deletedPost = await Post.destroy({
            where: {
                id: req.params.postId,
                // TODO: userId will come from req.session once we have set up our sessions
                userId: req.params.userId
            },
        });
        if(!deletedPost) return res.status(406).json({message: 'this request cannot be completed'})
        res.status(202).json(deletedPost);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

module.exports = router;