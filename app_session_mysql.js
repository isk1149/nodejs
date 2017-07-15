var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
//db에 sessions라는 테이블이 생긴다.
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.listen(3003, function(){
  console.log('connected 3003 port!')
});
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'gkstn123',
    database: 'test'
  };
app.use(session({
  secret: 'asdklfjlas#!#!@!2ASFdssds',
  resave: false,
  saveUninitialized: true,
  store:new MySQLStore(options)
  //cookie: { secure: true }
}));
/* mysql을 세션 저장소로 사용하려면 express-session모듈이
mysql에 접속해야한다. 그 접속정보를 options에 적는것.
일반적인 데이터를 db에 저장하는 것을 그것대로하고
세션을 db에 저장하는 것은 그것대로 세팅을 해주어야한다.*/

app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count++;
  }
  else{
    req.session.count = 1;
  }
  res.send('count: '+req.session.count);
});

app.get('/temp', function(req, res){
  res.send('result: '+req.session.count);
});

app.get('/auth/login', function(req, res){
  var output = `
  <h1> Login </h1>
<form action="/auth/login", method="post">
  <p>
    <input type='text' name="username"
    placeholder="user name">
  </p>
  <p>
    <input type="password" name="password"
    placeholder="password">
  </p>
  <p>
    <input type="submit">
  </p>
</form>
  `;

  res.send(output);
})


app.get('/welcome', function(req, res){
  if(req.session.displayName){
    res.send(`
      <h1> hello ${req.session.displayName}</h1>
        <a href="/auth/logout"> logout</a>
      `);
  }
  else{
    res.send(`
      <h1> welcome </h1>
      <a href="/auth/login"> login</a>
      `);
  }
});

app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  req.session.save(function(){//db에 로그인 정보가 삭제된 후에 이동하게끔.
      res.redirect('/welcome');
  });

});




app.post('/auth/login', function(req, res){
  var user = {
    username:'insung',
    password:'123',
    displayName:'isk1149'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if(uname===user.username && pwd === user.password){
    req.session.displayName = user.displayName;
    req.session.save(function(){//로그인 정보가 db에 저장된 후에 이동하게끔 해줌.
        res.redirect('/welcome');
    });

  }
  else{
    res.send('who are you?<a href="/auth/login">login</a>');
  }

});
