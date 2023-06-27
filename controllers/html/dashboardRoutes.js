const router = require('express').Router();
const sequelize = require('../../config/connection');
const {Post, User, Comment} = require('../../models');

//TODO: only authenticated users can access their dashboard
//TODO: once we have set up our sessions, remove ':userId' from endpoint and get userId from req.sessions instead
router.get('/:userId', async (req, res) => {
    try {
        const posts = await Post.findall({
            where: {
                //TODO: eventually, get userId from req.sessions instead of req.everyone
                userId: req.params.userId
            },
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
                const serializedPosts = posts.map((post) => this.post.get({ plain: true }));
            //TODO: modify response with actual view template
            res.status(200).send('<h1>DASHBOARD</h1><h2>Render the dashboard view along with all posts from logged in user.</h2>');
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

router.get('/post/:id', async (req, res) => {
    try {
    let post = await Post.findOne({
        where: {
            id: req.params.id,
            //TODO: might need to verify that post belongs to user attempting to view it
            // (userId will come from req.sessions once we have set up our sessions)
            userId: req.session.userId
        },
        include: [
            {model: Comment, include: {model: User, attributes: ['username']}}
        ],
        attributes: {
            include: [
                sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.postId = post.id)'),
                'commentsCount'
            ]
        }
    });
    if (!post) return res.status(404).json({message: 'No post found.'});

    post = post.get({ plain: true });

    //TODO: modify response with actual view template
    res.status(200).send('<h1>DASHBOARD</h1><h2>Render the dashboard view along with all posts from logged in user.</h2>');
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router;