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


exports.show = (req, res) => {}


exports.edit = (req, res) => {}


exports.delete = (req, res) => {}


exports.new = (req, res) => {
    res.render(`${viewPath}/new`, {
        pageTitle: 'Reservstion'
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


exports.update = (req, res) => {}