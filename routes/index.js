
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.session.token != null) {
	res.render('index', {title: 'Team Work', userName: req.session.userName});
  } else {
	return res.redirect('/login');
	}
  };
