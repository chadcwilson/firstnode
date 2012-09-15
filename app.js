
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// SLC Configurations
clientId = 'qK9cRwTOFR';
clientSecret = 'Lhk7xvgKThfNoihfBTI8ulnl6Vyo59fUtReH4A8RXJBXI1mv'; 
appUri = 'http://local.slidev.org:9999';
appAuthUri = 'http://local.slidev.org:9999/oauth';
apiUri = "https://api.sandbox.slcedu.org/api";
loginUri = "" + apiUri + "/oauth/authorize?Realm=SandboxIDP&response_type=code&client_id=" + clientId + "&redirect_uri=" + appAuthUri; 
sessionCheckUri = "" + apiUri + "/rest/v1/system/session/check";


console.log("Client ID: " + clientId)
console.log("Client Secret: "  + clientSecret)
console.log("Application URL: "+ appUri)
console.log("AppAuthURL: "+appAuthUri)
console.log("loginUri: " + loginUri)
console.log("sessionCheckUri: " + sessionCheckUri)
//sessionCheck=http.request(apiUri+"/rest/v1/system/session/check");
//console.log(sessionCheck)


  app.get('/', function(req, res) {
    if (req.session.token != null) {
      return res.render('index.jade', {
        title: 'Team Work',
        userName: req.session.userName
      });
    } else {
      return res.redirect('/login');
    }
  });


app.get('/login', function(req, res){
	return res.redirect(loginUri);
});


  app.get('/oauth', function(req, res) {
    var authCode, tokenUri;
    authCode = req.query['code'];
    console.log("AuthCode: "+authCode)
   tokenUri = "" + apiUri + "/oauth/token?code=" + authCode + "&client_id=" + clientId + "&redirect_uri=" + appAuthUri + "&client_secret=" + clientSecret;
    console.log("TokenURL:" + tokenUri)
    var temp;
    temp=get(tokenUri);
    console.log(temp);
    return request(tokenUri, function(error, response, body) {
      console.log("inside return");
       var json;
      if (error != null) {
        console.log("error: " + (util.inspect(error)));
        Error.throw500(req, res);
      }
      console.log("made it this far");
      console.log(body);
      console.log("Req: " +req);
      json = JSON.parse(body);
      req.session.token = json.access_token;
      console.log("session.token=" + req.session.token);
      return request({
        url: sessionCheckUri,
        headers: {
          "Authorization": "Bearer " + req.session.token
        }
      }, function(error, response, body) {
        if (error != null) {
          console.log("error: " + (util.inspect(error)));
          Error.throw500(req, res);
        }
        json = JSON.parse(body);
        req.session.userName = json.full_name;
        return res.redirect('/');
      });
    });
  });

  console.log("Out of Function");


// Routes

app.get('/', routes.index);
port = process.env.PORT || 9999
app.listen(port, function(){
  console.log("App running on Port "+ port);
});
