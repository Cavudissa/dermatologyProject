module.exports = function(Email) {
  // send an email
  Email.sendEmail = function(to,text,subject,cb) {
    Email.app.models.Email.send({
      to: to,
      from: 'dermosskincare@gmail.com',
      subject: subject,
      text: text
    }, function(err, mail) {
		if(err)
			return cb(err)
      cb(null,mail);
    });
  }
};
