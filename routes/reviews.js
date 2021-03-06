const { new: _new, index, show, create, edit, update, delete: _delete } = require('../controllers/ReviewsController');

function auth (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('danger', 'You need to login first.');
    return res.redirect('/login');
  }
  next();
}

module.exports = router => {
  router.get('/reviews', index);
  router.get('/reviews/new', auth, _new);
  router.post('/reviews', auth, create);  
  router.post('/reviews/update', auth, update);  
  router.post('/reviews/delete', auth, _delete); 
  router.get('/reviews/:id/edit', auth, edit);  
  router.get('/reviews/:id', show); 
};