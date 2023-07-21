module.exports = function(app){
    /** Auth Routes **/

    app.get('/login/particular',(req, res,next)=>{
        res.render("loginParticular.hbs",{postURL:'/login/particular'})   
    })    
    app.post('/login/particular',  (req, res,next)=> {		
		const userCredentials = {
            "password": req.body.password,
            "email": req.body.email
		}
		app.models.user.login(userCredentials, 'user', function (err, result) {			
			if (err) {
				if(err) return next({status:401,message:'Login Failed'})
            }
            var realm = result.__data.user.realm;
            const p = result.__data.user[realm];
            p.get((err,data)=>{
                if(err) return next({status:401,message:'Login Failed'})
				const access_token = result.id;
                const path = '/'+realm+'/'+data.id.toString() + '?accessToken='+access_token;
				res.status(200).json({url:path}) 
            }) 
		});
    });
    
    app.get('/logout/particular', function (req, res, next) {
		const access_token = req.query.accessToken;
		if (!access_token) {
			res.status(400).json({"error": "access token required"});
			return;
		}
		app.models.user.logout(access_token, function (err) {
			if (err) {
				res.status(404).json({"error": "logout failed"});
				return;
			}
			res.redirect('/home');
		});		
	});
}