var https = require("https");

module.exports = function(BaseApplicant) {

    BaseApplicant.getGender= function(name, profile, next){
        
        var firstName = username.split(" ");//HTPG
        var path= 'https://api.genderize.io/?name=' + firstName[0];
          console.log(path);
          //send HTTP request and get the data
          https.get(path, function(response){
              //debugger;
              //console.log(response);
              var body = ""
              response.on('data', function(data) {
                body += data;
              });
              response.on('end', function() {
                  var resp = JSON.parse(body);
                  console.log('response made for: ' + resp.length);
                  //debugger;
                  debugger;
                  console.log("adding company data");
                  console.dir(resp);
                  var gender = 'unknown';
                  if(resp.probability > .7){
                    gender = resp.gender
                  }
                  User.register(new User({
                    username: username,
                    Name: username,
                    Email: email,
                    Gender: gender,
                    CVUrl: cv,
                    OnBench: true,
                    ProfileUrl: profile,
                    crowdAdmin: true,
                    systemAdmin: true
                  }), req.body.password, function (err, user) {
                    if (err) {
                      console.log(err);
                      res.redirect("/");
                    } else {
                      console.log(user);
                      Passport.authenticate('local')(req, res, function () {
                        res.redirect("/");
                      });
                    }
                  });
              });
        var path= 'https://api.genderize.io/?name=' + name;
        console.log(path);
        //send HTTP request and get the data
        https.get(path, function(response){
            //debugger;
            //console.log(response);
            var body = ""
            response.on('data', function(data) {
              body += data;
            });
            response.on('end', function() {
                var resp = JSON.parse(body);
                console.log('response made for: ' + resp.length);
                //debugger;
                debugger;
                console.log("adding company data");
                console.dir(resp);
                var params={};
                next(resp);
            });
        });
    }
}