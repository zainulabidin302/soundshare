var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
}).get('/session/:id', function(req, res, next) {
  return {playback_url: '', current_seek_pos: '', session_id: ''};
}).post('/share', function(req, res, next) {
  //req.body.email_from
  //req.body.email_to
  //req.body.playback_url
  //req.body.session_id
  //req.body.current_seek_pos
});

module.exports = router;
