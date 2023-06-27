const router = require('express').Router();
const sequelize = require('../../config/connection');
const {User, Post, Comment} = require('../../models');

router.post('/', async (req, res) => {
    try {
    const newComment = await Comment.create({
        text: req.body.text,
        //TODO: userId will come from req.session once we have set up our sessions
        userId: req.body.userId,
        postId: req.body.postId
    });
    res.status(201).json(newComment);
    }
    catch (error) {
        console.log(error);
    res.status(500).json(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.findAll({
            include: [
            {model: User, attributes: ['username'] }, 
            {model: Post, include: {model: User, attributes: ['username']}},
        ],
        });
        res.status(201).json(comments);
    }
    catch (error) {
        console.log(error);
    res.status(500).json(error);
    }
});

router.get('/:commentId', async (req, res) => {
    try {
     const comments = await Comment.findByPk(req.params.commentId, {
          include: [
            {model: User, attributes: ['username'] }, 
            {model: Post, include: {model: User, attributes: ['username']}},
        ],
     });
         res.status(201).json(comments);  
    }
    catch (error) {
        console.log(error);
    res.status(500).json(error);
    }
});

//TODO: only authenticated users can update their comments
router.put('/:commentId', async (req, res) => {
    try {
        const updatedComment = await Comment.update(req.body, {
            where: {
                id: req.params.commentId,
                //TODO: verify that comment belongs to user attempting to update it (userId will come from req.session once we have set up our sessions)
                userId: req.session.userId
            },
        });
        if(!updatedComment[0]) return res.status(406).json({message: 'this request cannot be completed'});
        res.status(202).json(updatedComment);
    }
    catch (error) {
        console.log(error);
    res.status(500).json(error);
    }
});

//TODO: only admin or authenticated users can delete their comments
router.delete('/:commentId', async (req, res) => {
    try {
    const deletedComment = await Comment.destroy({
        where: {
            id: req.params.commentId,
            //TODO: verify that comment belongs to user attempting to update it (userId will come from req.session once we have set up our sessions)
            userId: req.session.userId
        },
    });
    if (!deletedComment[0]) return res.status(406).json({message: 'this request cannot be completed'});
    res.status(202).json(deletedComment);
    }
    catch (error) {
        console.log(error);
    res.status(500).json(error);
    }
});

module.exports = router;