const router = require('express').Router();

router.use((req, res) => res.send('<h1>Oops! Wrong Route!</h1>'));

module.exports = router;