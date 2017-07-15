var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');//쿠키관련 작업은 npm install을 통해 다운.
app.use(cookieParser('klasdf!@#SDaf@'));//쿠키의 보안을 위한 키값을 설정.
//request할때 암호화된 정보를 그대로 보낸다. 우리는 키값을 알고 있기 때문에
//response headers에 있는 암호화된 정보를 해독 가능.
app.listen(3003, function(){
  console.log('connected 3003 port!')
});


app.get('/count', function(req, res){
  //req에는 cookies라는 객체가 잇음.
  //res.cookie('count', 1); -> 이렇게하면 response headers의 set-cookie에 count=1이 생김
 // signedCookies는 암호화된 쿠키를 해독해서 사용할 수 잇다.
  if(req.signedCookies.count){//javascript에서는 값이 있으면 트루, 없으면 폴스
    var count = parseInt(req.cookies.count);//숫자도 문자로 전송되기 때문에 정수로 바꿔주기
  }
  else{
    var count = 0;//count값이 없으면 0으로 초기화세팅한다.
  }
  count = count+1;
  res.cookie('count', count, {signed:true});// 보안상 쿠키를 구울때도 signed:true를 주어야 함.
  res.send('count: '+count);
});


var products = {
  1:{title:'The history of web'},
  2:{title:'The next web'}
};
app.get('/products', function(req, res){
  var output =  '';
  for(var index in products){//index에는 products의 1, 2가 들어간다.
    output += `
    <li>
      <a href="/cart/${index}">${products[index].title}</a>
    </li>`;
  }
  res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});


app.get('/cart', function(req, res){
  var cart = req.signedCookies.cart;
  if(!cart){
    res.send('empty cookie');
  }
  else{
    var output='';
    for(var id in cart){
      output+=`<li>${products[id].title} (${cart[id]}) </li>`;
    }
  }
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href="/products">Products list</a>`);
});

// var a = {}; 빈 객체 생성;
/*var b = {
1:100,
2:101,
3:102
}          b[1] == 100.
           b[4] ==  없다.
*/
app.get('/cart/:id', function(req, res){
  var id = req.params.id;
  if(req.signedCookies.cart){//쿠키값이 있으면 그대로 사용
    var cart = req.signedCookies.cart;
  }
  else{//쿠키값이 없는 경우. 우선 쿠키로 사용할 객체 생성.
    var cart = {};
  }
  if(!cart[id]){ // id값에 따라 값이 없을 수 있다. ex)위의 b[4]
    cart[id] = 0; // parseInt(cart[id])+1;할 때 없는값 +1은 말이 안되므로.
  }
  cart[id] = parseInt(cart[id])+1;
  res.cookie('cart', cart, {signed:true});
  res.redirect('/cart');
});
