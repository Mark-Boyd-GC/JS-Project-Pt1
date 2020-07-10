// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation
  

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/

const viewPath = 'reviews';
const Review = require('../models/Review');
const User = require('../models/User');

exports.index = async (req, res) => {
  try {
    const reviews = await Review
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Reviews',
      reviews: reviews
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying the reviews: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user');
    console.log(review);
    res.render(`${viewPath}/show`, {
      pageTitle: review.title,
      review: review
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this review: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Review'
  });
};

exports.create = async (req, res) => {
  try {
    console.log(req.session.passport);
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    console.log('User', user);
    const review = await Review.create({user: user._id, ...req.body});

    req.flash('success', 'Review created successfully');
    res.redirect(`/reviews/${review.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this review: ${error}`);
    req.session.formData = req.body;
    res.redirect('/reviews/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: review.title,
      formData: review
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this review: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let review = await Review.findById(req.body.id);
    if (!review) throw new Error('Review could not be found');

    const attributes = {user: user._id, ...req.body};
    await Review.validate(attributes);
    await Review.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The review was updated successfully');
    res.redirect(`/reviews/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this review: ${error}`);
    res.redirect(`/reviews/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    await Review.deleteOne({_id: req.body.id});
    req.flash('success', 'The review was deleted successfully');
    res.redirect(`/reviews`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this review: ${error}`);
    res.redirect(`/reviews`);
  }
};