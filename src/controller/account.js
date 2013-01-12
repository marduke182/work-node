
/*
 * GET home page.
 */

exports.actions = function(app,model){


    function requireLogin(req, res, next) {
        if(req.session.user) {
            next();
      
        } else {
            res.redirect("/sessions/new?redir="+req.url);
        }
    };
    
    app.get('/', requireLogin, function(req, res){
        res.render('index', {
            title: 'Express'
        });
    });

    app.get('/sessions/new', function(req,res) {
        res.render('sessions/new', {
            redir: req.body.redir
        });

    });



    app.post('/sessions', function(req,res) {
        console.log(model);
        model.user.findOne({
            name: req.body.login
        }, function(err,user){
        
            if(err instanceof Error) {
                console.log("Ocurrio un error buscando el usuario");   
            } else if(user && user.authenticate(req.body.password)){
            
            
                req.session.user = true;
                res.redirect(req.body.redir || "/");

            } else {
                //            req.flash('error', 'Incorrect credentials');
                res.render('sessions/new', {
                    redir: req.body.redir
                });
            //          res.redirect('/sessions/new');
            }

        });
    });

    app.use('/prueba',function(req,res) {
        console.log(req.body.user);
        res.send("asd");
    });

    app.use('/account/create', function(req, res) {
    
        if(req.method == "POST") {
        
        }

        res.render('sessions/new', {
            redir: req.body.redir
        });
    });

};
