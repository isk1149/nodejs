var express = require('express');
var app = express(); // express를 사용하려면 이 두줄까지는 형식적으로 작성.
var bodyParser = require('body-parser');//post방식을 사용하기 위한 모듈
app.use(bodyParser.urlencoded({extended: false}));//post방식을 사용하기 위한 모듈

app.use(express.static('public'));//정적인 파일은 public폴더에서 꺼내 쓴다는 선언.
app.set('view engine', 'jade'); //jade와 express를 연결.
app.set('views', './views'); //템플릿이 있는 폴더를 express에 알려주는 코드. 관습적으로 views라는 이름으로 정했다.

/*express에는 listen이라는 메소드가 있는데 포트번호를 지정해주면 리스닝한다*/
app.listen(80, '127.0.0.1', ()=>{
  console.log("connected 3000 port");
})

/*사용자가 웹서버에 접속할때는 get방식 or post방식이 잇다.
보통 url을 치고 들어오는 경우는 get방식*/

// '/'은 홈으로 들어온 경우
//req는 사용자가 요청한 것과 관련된 정보를 담은 객체
//res는 응답에 대한 객체.
//get함수는 라우터의 기능이다.
app.get('/', (req, res)=>{
  res.send('welcome to home');
  //res.send('end'); <- res.send는 그 다음 문장들은 실행하지 않고 끝낸므로 이 명령은 실행되지 않음.
});

app.get('/login', (req, res)=>{
  res.send('<h1>login page</h1>');
})

//나름 동적으로 만든 페이지인데
app.get('/dynamic', function(req, res){
  var lis = '';
  for(var i=0; i<5; i++){
    lis = lis + '<li>coding</li>';
  }
  var time = Date();
  var output = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
      Hello, Dynamic!
        <ul>
          ${lis}
        </ul>
        ${time}
    </body>
  </html>`;
  res.send(output);
 });

/////////////////////////////////////////////////////////////////////////////////////////////////
//semantic url에서는 req.query 대신 req.params
//app.get('/topic/:id', function(req, res){
app.get(['/topic', '/topic/:id'], (req, res)=>
{
  var topics = [
    'Javascript is....',
    'Nodejs is...',
    'Express is...'
  ];
  var output = `
  <a href="/topic/0">JavaScript</a><br>
  <a href="/topic/1">Nodejs</a><br>
  <a href="/topic/2">Express</a><br><br>
  ${topics[req.params.id]}
  `;
  res.send(output);
});

app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id+','+req.params.mode)
});


//query string 방식
//req.query.id => request객체가 가지는 query객체의 id값
//즉 사용자가 url을 통해 입력한 주소가 req로 전달되고 그 중 query객체의 id값을 받는다.??
/*
app.get('/topic', function(req, res){
  var topics = [
    'Javascript is....',
    'Nodejs is...',
    'Express is...'
  ];
  var output = `
  <a href="/topic?id=0">JavaScript</a><br>
  <a href="/topic?id=1">Nodejs</a><br>
  <a href="/topic?id=2">Express</a><br><br>
  ${topics[req.query.id]}
  `
  res.send(output);
})
*/
/////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/form', function(req, res){
   res.render('form');
 });

/*
app.get('/form_receiver', function(req, res){
   var title = req.query.title;
   var description = req.query.description;
   res.send(title+','+description);
 });*/


//post방식은 req.query가 아니라 req.body를 쓴다.
//기본적으로 post방식으로 전달되는 데이터는 undefined상태이다. 이용하려면 body-parser설치.
 app.post('/form_receiver', function(req, res){
   var title = req.body.title;
   var description = req.body.description;
   res.send(title+','+description);
 });













/*
 app.get('/template', (req, res)=>{
   //템플릿을 사용할 때는  render함수 사용.
   ///template를 통해 들어온 사용자에게 temp.jade라는 파일을 렌더링해서 화면에 띄어준다.
   //render는 템플릿 함수이므로 자동적으로 views폴더에 있는 temp.jade를 찾는다.
   res.render('temp', {time_value:Date(), title_value:'Jadess'});
 });
*/

/*
 app.get('/flowers', (req, res)=>{
   res.send('<img src="/flower.jpg">');
 })
 */
