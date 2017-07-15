var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser('kl12kzxcsmmmmm'));
app.listen(3003, function(){
  console.log('connected 3003 port!')
});


app.get('/count', function(req, res){
  if(req.signedCookies.count){//javascript에서는 값이 있으면 트루, 없으면 폴스
    var count = parseInt(req.cookies.count);//숫자도 문자로 전송되기 때문에 정수로 바꿔주기
  }
  else{
    var count = 0;
  }
  count = count+1;
  res.cookie('count', count, {signed:true});
  res.send('count: '+count);
});
var products = {
  1:{title:'The history of web'},
  2:{title:'The next web'}
};
app.get('/products', function(req, res){
  var output =  '';
  for(var name in products){
    output += `
    <li>
      <a href="/cart/${name}">"${products[name].title}</a>
    </li>`;
  }
  res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});

app.get('/cart/:id', function(req, res){
  var id = req.params.id;
  if(req.signedCookies.cart){
    var cart = req.signedCookies.cart;
  }
  else{
    var cart = {};
  }
  if(!cart[id]){
    cart[id] = 0;
  }
  cart[id] = parseInt(cart[id])+1;
  res.cookie('cart', cart, {signed:true});
  res.redirect('/cart');
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
})
