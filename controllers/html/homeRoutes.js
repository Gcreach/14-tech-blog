const router = require('express').Router();
const sequelize = require('../../config/connection');
const {Post, User, Comment} = require('../../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const posts = await Post.findall({
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
    res.render('homepage', {
        users,
        // Pass the logged in flag to the template
        logged_in: req.session.logged_in,
      });
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

router.get('/post/:id', async (req, res) => {
    try {
    let post = await Post.findByPk(req.params.id, {
        include: [
        {model: User, attributes: ['username'] },
        {model: Comment, include: {model: User, attributes: ['username']}}
    ],
        attributes: {
            include: [
                [
                    sequelize.literal('(SELECT COUNT(*) FROM comment WHERE comment.postId = post.id)'), 
                    'commentsCount',
                ],
            ],
        },
    });
    
    if (!post) return res.status(404).json({message: 'No post found.'});

    post = post.get({ plain: true});

    
    res.render('homepage', {
        users,
        // Pass the logged in flag to the template
        logged_in: req.session.logged_in,
      });
    }
    catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

router.get('/signup', async (req, res) => {
    //TODO: redirect to dashboard if user is already logged in
    //TODO: modify response with actual view template
    res.status(200).send(
        '<h1>SIGN UP PAGE</h1><h2>Render the  signup view.</h2>');
});

router.get('/login', async (req, res) => {
    //TODO: redirect to dashboard if user is already logged in
    //TODO: modify response with actual view template
    res.status(200).send(
        '<h1>LOGIN PAGE</h1><h2>Render the  signup view.</h2>');
});

module.exports = router;