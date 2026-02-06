const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send('Fetching all blog posts from the modular router!');
});

router.post('/', (req, res) => {
  res.send('Creating a new blog post...');
});

module.exports = router;