// You need to complete this controller with the required 7 actions
const reservation = require('../models/reservation');
const reservations = require('../routes/reservations');
const user= require('../models/user');
const viewPath='reservations';
const restaurants = ["hhfjdhf","gfbwejhbf","wefhbwe"];
exports.index = async (req, res) => {
    try{
        const reservations = await reservation
        .find()
        .populate('user')
        .sort({updatedAt: 'desc'});

        res.render(`${viewPath}/index`, {
        pageTitle: 'Archive',
            reservations:reservations
    });
}catch (error){
    req.flash('There was an error in reservation process.');
    res.redirect('/')
}
}


exports.show = async (req, res) =>{try {
    const reservations = await reservation.findById(req.params.id)
      .populate('user');
    console.log(reservation);
    res.render(`${viewPath}/show`, {
      pageTitle: reservation.title,
      
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this reservation: ${error}`);
    res.redirect('/');
  }
};



exports.edit = async(req, res) => {try {
    const reservation = await reservation.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: reservation.title,
      formData: reservation
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this reservation: ${error}`);
    res.redirect('/');
  }}


exports.delete = async(req, res) => {
    try {
    console.log(req.body);
    await reservation.deleteOne({_id: req.body.id});
    req.flash('success', 'The reservation was deleted successfully');
    res.redirect(`/reservations`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this reservation: ${error}`);
    res.redirect(`/reservations`);
  }
};


exports.new = (req, res) => {
    res.render(`${viewPath}/new`, {
        pageTitle: 'Reservation detail'
       })
}


exports.create = async  (req, res) => {console.log(req.session.passport);
    try{
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    console.log('User', user);
    const reservation = await reservation.create({user: user._id, ...req.body});
    console.log('trying...');
    req.flash('success', 'Reserved successfully');
    res.redirect(`/reservations/${reservation.id}`);
  } catch (error) {

    req.flash('danger', `There was an error creating this reservation: ${error}`);
    req.session.formData = req.body;
    res.redirect('/reservations/new');
  }
};


exports.update = async(req, res) => { try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    console.log('got the user', user)
    let reservation = await reservation.findById(req.body.id);
    if (!reservation) throw new Error('Reservation could not be found');

    const attributes = {user: user._id, ...req.body};
    await reservation.validate(attributes);
    await reservation.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The reservation was changed successfully');
    res.redirect(`/reservations/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this reservation: ${error}`);
    res.redirect(`/reservation/${req.body.id}/edit`);
  }};