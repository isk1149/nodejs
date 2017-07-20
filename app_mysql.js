var express = require('express');
 var bodyParser = require('body-parser');
 var mysql      = require('mysql');
 var conn = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'gkstn123',
   database : 'o2'
 });

 conn.connect(function(err){
   if(!err) {
    console.log("Database is connected ... \n\n");
} else {
    console.log("Error connecting database ... \n\n");
}
 });
 var fs = require('fs');
 var app = express();
 app.use(bodyParser.urlencoded({ extended: false }));
 app.locals.pretty = true; // 웹브라우저상에서 html구문 이쁘게 해줌
 //app.use('/user', express.static('uploads'));
 app.set('views', './views_mysql');
 app.set('view engine', 'jade');

 app.get('/topic/add', function(req, res){

   var sql = 'select id, title from topic';
   conn.query(sql, function(err, rows, fields){
     if(err){
       console.log(err);
       res.status(500).send('err!!!!!!!');
     }
     res.render('add', {topics:rows});//view.jade파일에 해당 원소들 주입.
   });
/*
   fs.readdir('data', function(err, files){//디렉토리를 읽는다
     if(err){
       console.log(err);
       res.status(500).send('err!!!!!!!');
     }
     res.render('add', {topics:files});//확장자를 뺀 템플릿 파일이름
   });*/
 });

//send함수가 실행되면 그 다음은 실행되지 않음.
 app.post('/topic/add', function(req, res){
   var title = req.body.title;
   var description = req.body.description;
   var author = req.body.author;

   var sql = 'insert into topic(title, description, author) values(?,?,?)';
   conn.query(sql, [title, description, author], function(err, rows, fields){

     if(err){
       //예를 들면 data2처럼 없는 폴더에 저장한다면 에러.
       //status(500)은 에러낫다고 컴퓨터에게 알리는 방법.
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      else{
        //res.send(rows); 어떤 값이 필요한지는 rows를 띄우고 어떤식으로 부를지 확인.
        res.redirect('/topic/'+rows.insertId);
      }
   });

 });

 app.get(['/topic/:id/edit'], function(req, res){

   var sql = 'select id, title from topic';
   conn.query(sql, function(err, rows, fields){

     var id = req.params.id;
     if(id){
       var sql = 'select * from topic where id=?';
       conn.query(sql, [id], function(err, rows2, fields){
         if(err){
           console.log(err);
           res.status(500).send('Internal Server Error');
         }
         else{
           res.render('edit', {topics:rows, row:rows2[0]});//view.jade파일에 해당 원소들 주입.
         }
       });
     }
     else{
       console.log('there is no id');
       res.status(500).send('Internal Server Error');
     }

   });

 });

 app.post(['/topic/:id/edit'], function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'update topic set title=?, description=?, author=? where id=?';
  conn.query(sql, [title, description, author, id], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('internal server error');
    }
    else{
      res.redirect('/topic/'+id);
    }
  });
});

 app.get(['/topic', '/topic/:id'], function(req, res){

   var sql = 'select id, title from topic';
   conn.query(sql, function(err, rows, fields){

     var id = req.params.id;
     if(id){
       var sql = 'select * from topic where id=?';
       conn.query(sql, [id], function(err, rows2, fields){
         if(err){
           console.log(err);
           res.status(500).send('Internal Server Error');
         }
         else{
           res.render('view', {topics:rows, row:rows2[0]});//view.jade파일에 해당 원소들 주입.
         }
       });
     }
     else{
       res.render('view', {topics:rows});//view.jade파일에 해당 원소들 주입.
     }

   });

});


app.get('/topic/:id/delete', function(req, res){
  var sql = 'select id, title from topic';
  var id = req.params.id;
  conn.query(sql, function(err, topics, fields){
    var sql = 'select * from topic where id=?';

    conn.query(sql, [id], function(err, rows, fields){
      if(err){
        console.log(err);
        res.status(500).send('server internal err!!!!!!!');
      }
      else{
        if(rows.length === 0){
          console.log('There is no record.');
          res.status(500).send('Internal server err');
        }
        else{
          res.render('delete', {topics:rows, row:rows[0]});
        }

      }
    });

  });
});
app.post('/topic/:id/delete', function(req, res){
  var id = req.params.id;
  var sql = 'delete from topic where id=?';
  conn.query(sql, [id], function(err, rows){
    res.redirect('/topic');
  });
});








 app.listen(3000, function(){
   console.log('Connected, 3000 port!');
 })
