var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.listen(3003, function(){
  console.log('connected 3003 port!')
});
app.use(session({
  secret: 'asdklfjlas#!#!@!2ASFdssds',//세션id를 웹브라우저에 심을 때 키값을 만드는 랜덤값을 써준다.
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

//express-session 모듈은 사용자의 데이터를 메모리에 저장하기 때문에
//서버를 껏다 키면 세션이 유지되지 않음.따라서 서비스용으로는 사용하지 않는다. 
//서비스용은 db에 저장하는 방식을 사용.
app.get('/count', function(req, res){
  if(req.session.count){//req에 session이라는 객체 잇음.
    //session객체는 sid라는 고유값을 통해 사용자마다 다른 데이터를 저장하고 잇다.
    req.session.count++;
  }
  else{
    req.session.count = 1; // count라는 데이터를 서버에 저장한다.
    //count는 웹브라우저의 sid와 연결되어잇다.
    //따로 변수선언 안하고 그냥 잇는셈치고 사용하면 되는 듯.
  }
  res.send('count: '+req.session.count);
});
app.get('/temp', function(req, res){
  res.send('result: '+req.session.count);
});


//로그아웃하면 세션이 사라짐.
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
});


app.get('/welcome', function(req, res){
  if(req.session.displayName){//세션에 displayName값이 잇다는 건 로그인이 성공햇다는 것.
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
  //로그인할때 displayName을 사용햇으니까 로그아웃할때도 displayName를 이용.
  res.redirect('/welcome');
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
    res.redirect('/welcome');
  }
  else{
    res.send('who are you?<a href="/auth/login">login</a>');
  }
  //res.send(uname);
});
