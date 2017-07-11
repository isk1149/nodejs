var express = require('express');
 var bodyParser = require('body-parser');
 /*var multer = require('multer');
 var _storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, 'uploads/')
   },
   filename: function (req, file, cb) {
     cb(null, file.originalname);
   }
 })
 var upload = multer({ storage: _storage })*/
 var fs = require('fs');
 var app = express();
 app.use(bodyParser.urlencoded({ extended: false }));
 app.locals.pretty = true; // 웹브라우저상에서 html구문 이쁘게 해줌
 //app.use('/user', express.static('uploads'));
 app.set('views', './views_file');
 app.set('view engine', 'jade');
 /*app.get('/upload', function(req, res){
   res.render('upload');
 });
 app.post('/upload', upload.single('userfile'), function(req, res){
   res.send('Uploaded : '+req.file.filename);
 });*/


 /*
 app.get(['/topic', '/topic/:id'], function(req, res){
   fs.readdir('data', function(err, files){
     if(err){
       console.log(err);
       res.status(500).send('Internal Server Error');
     }
     var id = req.params.id;
     if(id){
       // id값이 있을 때
       fs.readFile('data/'+id, 'utf8', function(err, data){
         if(err){
           console.log(err);
           res.status(500).send('Internal Server Error');
         }
         res.render('view', {topics:files, title:id, description:data});
       })
     } else {
       // id 값이 없을 때
       res.render('view', {topics:files, title:'Welcome', description:'Hello, JavaScript for server.'});
     }
   })
 });*/

 app.get('/topic/new', function(req, res){
   fs.readdir('data', function(err, files){//디렉토리를 읽는다
     if(err){
       console.log(err);
       res.status(500).send('err!!!!!!!');
     }
     res.render('new', {topics:files});//확장자를 뺀 템플릿 파일이름
   });
 });

//send함수가 실행되면 그 다음은 실행되지 않음.
 app.post('/topic', function(req, res){
   var title = req.body.title;
   var description = req.body.description;
   fs.writeFile('data/'+title, description, function(err){
    if(err){
      //예를 들면 data2처럼 없는 폴더에 저장한다면 에러.
      //status(500)은 에러낫다고 컴퓨터에게 알리고 사용자에게 문구 띄움.
       console.log(err);
       res.status(500).send('Internal Server Error');
     }
     res.redirect('/topic/'+title);//redirect를 통해 특정 페이지로 보내버림
   });
 });

 app.get(['/topic', '/topic/:id'], function(req, res){
  fs.readdir('data', function(err, files){//디렉토리를 읽는다
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    var id = req.params.id;

    if(id){
      //id값이 있을 때
      fs.readFile('data/'+id, 'utf8', function(err, data){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view', {topics:files, title:id, description:data});
      });
    }
    else{
      //id값이 없을 때
      res.render('view', {topics:files, title:'Welcome', description:'hello javascript'});//첫 번째 인자는 확장자를 뺀 템플릿 파일이름
    }

  });
});

 app.listen(3000, function(){
   console.log('Connected, 3000 port!');
 })
