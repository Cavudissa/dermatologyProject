function defineRoles(app,cb){
  app.dataSources.testDB.automigrate(function(err) {
    if (err) throw err;
		app.models.Role.create({
			name: 'doctor'
			}, function(err, role) {
			if (err) throw err;
			app.models.Role.create({
				name: 'patient'
				}, function(err, role) {
				if (err) throw err;
				app.models.Role.create({
					name: 'nurse'
					}, function(err, role) {
					if (err) throw err;
					app.models.Role.create({
						name: 'admin'
						}, function(err, role) {
						if (err) throw err;
						app.models.Role.create({
							name: 'administrative'
							}, function(err, role) {
							if (err) throw err;
							cb(null,role)
						})
					})
				})
			})
		})
  });
}

module.exports = defineRoles;